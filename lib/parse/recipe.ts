import { Ingredient } from './ingredient'

type ProcedureParts = { text: string }

export type Recipe = {
  title: string
  image?: string
  prepTime?: string
  cookTime?: string
  totalTime?: string
  recipeYield?: string | number
  source?: string
  ingredients: Ingredient[]
  instructions: ProcedureParts[]
}

export type RecipeParts = Partial<Recipe>
