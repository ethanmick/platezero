import * as cheerio from 'cheerio'
import { normalize } from './normalize'
import { parse as LDJSONParse } from './parsers/ld-json'
import { Recipe } from './types'

type Raw = {
  raw: string
}

export const parseRaw = <T extends Raw>({ raw }: T) => ({
  raw,
  normalized: normalize(raw),
})

export const parse = async (html: string): Promise<Recipe> => {
  const $ = cheerio.load(html)
  const recipe = await LDJSONParse($)
  if (!recipe) {
    throw new Error('failed to parse recipe')
  }
  if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
    throw new Error('invalid recipe')
  }

  recipe.ingredients = recipe.ingredients.map(parseRaw)
  recipe.instructions = recipe.instructions.map(parseRaw)
  return recipe as Recipe
}
