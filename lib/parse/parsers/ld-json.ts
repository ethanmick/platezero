import * as cheerio from 'cheerio'
import { parseIngredient } from '../ingredient'
import { RecipeParts } from '../recipe'

// Google has a library for these "schema-dts", but the types are _really_ stupid.
// So I've rebuilt my own simpler version here
type LDJSONRecipe = {
  '@type': string
  author?: {
    '@type': 'Person'
    name?: string
  }
  description?: string
  name?: string
  // These should be in ISO_8601 format, eg, PT30M
  prepTime?: string
  cookTime?: string
  totalTime?: string
  recipeYield?: string | number
  image?: string
  datePublished?: string // ISO_8601 format
  recipeIngredient?: string[]
  recipeInstructions: {
    '@type': 'HowToStep'
    text: string
  }[]
}

export const parse = async (
  $: cheerio.CheerioAPI
): Promise<RecipeParts | null> => {
  const json: LDJSONRecipe = $('script[type="application/ld+json"]')
    .map((_, el) => {
      try {
        return JSON.parse($(el).text())
      } catch {}
    })
    .filter((_, val: LDJSONRecipe | undefined) => val?.['@type'] === 'Recipe')
    .get()[0]

  if (!json) {
    return null
  }

  return {
    title: json.name,
    image: json.image,
    prepTime: json.prepTime,
    cookTime: json.cookTime,
    totalTime: json.totalTime,
    recipeYield: json.recipeYield,
    ingredients: json.recipeIngredient
      ?.map(parseIngredient)
      .filter((i) => i.name),
    instructions: json.recipeInstructions.map(({ text }) => ({
      text,
    })),
  }
}
