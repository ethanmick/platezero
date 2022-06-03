import { Ingredient } from './ingredient'

type ProcedureParts = { text: string }

export type Recipe = {
  title: string
  image?: string
  ingredients: Ingredient[]
  instructions: ProcedureParts[]
}

export type RecipeParts = Partial<Recipe>
