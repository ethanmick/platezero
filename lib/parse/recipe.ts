import { Ingredient } from './ingredient'

type ProcedureParts = { text: string }

export type RecipeParts = {
  title?: string
  ingredients?: Ingredient[]
  instructions?: ProcedureParts[]
}
