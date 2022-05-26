import * as cheerio from 'cheerio'
import { parse as LDJSONParse } from './parsers/ld-json'
import { RecipeParts } from './recipe'

export const parse = async (html: string): Promise<RecipeParts> => {
  const $ = cheerio.load(html)
  const recipe = await LDJSONParse($)
  if (!recipe) {
    throw new Error('failed to parse recipe')
  }
  return recipe
}
