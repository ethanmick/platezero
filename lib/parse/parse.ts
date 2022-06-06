import * as cheerio from 'cheerio'
import { normalize } from './normalize'
import { parse as LDJSONParse } from './parsers/ld-json'
import { Recipe } from './types'

export const parse = async (html: string): Promise<Recipe> => {
  const $ = cheerio.load(html)
  const recipe = await LDJSONParse($)
  if (!recipe) {
    throw new Error('failed to parse recipe')
  }
  if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
    throw new Error('invalid recipe')
  }

  recipe.ingredients = recipe.ingredients.map(({ raw }) => ({
    raw,
    normalized: normalize(raw),
  }))

  recipe.instructions = recipe.instructions.map(({ raw }) => ({
    raw,
    normalized: normalize(raw),
  }))

  return recipe as Recipe
}
