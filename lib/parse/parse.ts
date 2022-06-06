import * as cheerio from 'cheerio'
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
  return recipe as Recipe
}
