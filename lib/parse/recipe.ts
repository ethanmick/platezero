import { Ingredient } from './ingredient'

type ProcedureParts = { text: string }

export type Recipe = {
  title: string
  ingredients: Ingredient[]
  instructions: ProcedureParts[]
}

export type RecipeParts = Partial<Recipe>
