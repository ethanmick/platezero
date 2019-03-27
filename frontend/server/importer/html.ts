import { parse } from '../../common/ingredient'
import * as _ from 'lodash'
import * as cheerio from 'cheerio'
import {
  ProcedureListJSON,
  ProcedureLineJSON,
  IngredientListJSON,
  IngredientLineJSON,
  PreheatJSON
} from '../../models'
const TurndownService = require('turndown')

export const text = (sel: string) => ($: any) => _.trim($(sel).text())

export const title = () => {
  return ($: any): string => {
    let title = _.trim($('meta[name="twitter:title"]').attr('content'))
    if (title) {
      return title
    }
    title = _.trim($('meta[property="og:title"]').attr('content'))
    if (title) {
      return title
    }
    return text('title')($)
  }
}

export const description = (sel?: string) => {
  if (sel) {
    return text(sel)
  }
  return ($: any) => {
    let description = _.trim(
      $('meta[property="twitter:description"]').attr('content')
    )
    if (description) {
      return description
    }
    description = _.trim($('meta[property="og:description"]').attr('content'))
    if (description) {
      return description
    }
    description = _.trim($('meta[itemprop="description"]').attr('content'))
    if (description) {
      return description
    }
    return undefined
  }
}

export const image_url = (sel?: string) => ($: any) => {
  if (sel) {
    return $(sel).attr('src')
  }
  let image = $('meta[property="twitter:image"]').attr('content')
  if (image) {
    return image
  }
  image = $('meta[property="og:image"]').attr('content')
  if (image) {
    return image
  }
  image = $('article img')
    .first()
    .attr('src')
  if (image) {
    return image
  }
  return $('main img')
    .first()
    .attr('src')
}

// https://regex101.com/r/xqkIKF/1
export const preheats = (sel?: string) => ($: any): PreheatJSON[] => {
  const utilities = ['oven', 'sous vide', 'stove']
  const regex = new RegExp(
    `(${utilities.join('|')})\\s[a-z]*\\s?(\\d+)\\s?(degrees|º|°)?\\s?(C|F)?`,
    'gim'
  )
  const preheats: PreheatJSON[] = []
  let m
  const text = _.trim(sel ? $(sel).text() : $.text())
  while ((m = regex.exec(text)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    preheats.push({
      name: m[1],
      temperature: parseInt(m[2]),
      unit: m[4] || 'F' //TODO: Default to user preference?
    })
  }
  return preheats
}

// find and map dom elements
export interface FindMap {
  id?: RegExp
  css?: RegExp
  selector?: string
  map: Function
}

const findMap = ($: any, options: FindMap) => {
  const opts = _.defaults(options, {
    selector: '*'
  })
  return $(opts.selector)
    .filter(function() {
      if (opts.css) {
        return ($(this).attr('class') || '').match(opts.css)
      }
      if (opts.id) {
        return ($(this).attr('id') || '').match(opts.id)
      }
      return true
    })
    .map(function() {
      return opts.map.apply(this, arguments)
    })
    .get()
}

/* Ingredient List Strategies */
function ingredientMapper($: any) {
  return function() {
    return parse(_.trim($(this).text()))
  }
}

// 1. https://schema.org/Recipe
// Search for well known paths
export const recipeSchemaIngredientLists = ($: any) => {
  const search = [
    // https://schema.org/Recipe
    { selector: 'li[itemprop="recipeIngredient"]' },
    // https://easyrecipeplugin.com/
    { selector: 'li[itemprop="ingredients"]' },
    { selector: 'ul li', css: /ingredient/i },
    // https://www.wptasty.com/tasty-recipes
    { selector: 'div.tasty-recipes ul li' }
  ]
  for (let s of search) {
    const found = findMap($, {
      ...s,
      ...{ map: ingredientMapper($) }
    })
    if (found.length > 1) {
      return found
    }
  }
  return []
}

// 2. PlateZero::thing
// TODO: will probably remove
export const plateZeroIngredientLists = ($: any): IngredientLineJSON[] => {
  const lines = $('*')
    .filter(function() {
      return /^ingredients$/gim.test(
        $(this)
          .text()
          .trim()
      )
    })
    .first()
    .next()
    .closest('ul')
    .find('li')
    .map(function() {
      return parse($(this).text())
    })
    .get()
  return lines
}

// 3. Find them yourself
export const ingredient_lists = (sel: string) => (
  $: any
): IngredientListJSON[] => [
  {
    lines: $(sel)
      .map(function() {
        return parse(_.trim($(this).text()))
      })
      .get()
  }
]

/* END Ingredient List Strategies */

/* Find Procedure Lists Strategies */

function procedureMapper($: any) {
  return function() {
    return { text: _.trim($(this).text()) }
  }
}

// Search for well known paths
export const recipeSchemaProcedureLists = ($: any) => {
  const search = [
    { selector: 'ol[itemprop="recipeInstructions"] li' },
    { selector: 'ol li[itemprop="recipeInstructions"]' },
    { selector: 'div[itemprop="recipeInstructions"] ol li' },
    { selector: 'ol li', css: /instruction/i },
    // https://www.wptasty.com/tasty-recipes
    { selector: 'div.tasty-recipes ol li' }
    // https://easyrecipeplugin.com/
  ]
  for (let s of search) {
    const found = findMap($, {
      ...s,
      ...{ map: procedureMapper($) }
    })
    // Maybe 1?
    if (found.length > 0) {
      return found
    }
  }
  return []
}

// 2. PlateZero Custom
export const plateZeroProcedureLists = ($: any): ProcedureLineJSON[] => {
  const lines = $('*')
    .filter(function() {
      return /^instructions$/gim.test(
        $(this)
          .text()
          .trim()
      )
    })
    .first()
    .next()
    .closest('ol')
    .find('li')
    .map(function() {
      return { text: $(this).text() }
    })
    .get()
  return lines
}

// 3. Find your own
export const procedure_lists = (sel: string) => (
  $: any
): ProcedureListJSON[] => {
  const turndown = new TurndownService()
  return [
    {
      lines: $(sel)
        .map(function() {
          return {
            text: turndown.turndown($(this).html())
          }
        })
        .get()
    }
  ]
}

export const defaults = (overrides: object) => {
  return _.defaults(overrides, {
    title: title(),
    subtitle: undefined,
    description: description(),
    image_url: image_url(),
    source_url: undefined,
    html_url: undefined,
    yield: undefined,
    duration: undefined,
    preheats: preheats(),
    ingredient_lists: undefined,
    procedure_lists: undefined
  })
}

export const dom = (f: any) => (html: string) => f(cheerio.load(html))