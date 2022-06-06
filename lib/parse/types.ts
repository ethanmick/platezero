export type Ingredient = {
  raw: string
  normalized?: string
}

export type Instructions = {
  raw: string
  normalized?: string
}

export type Recipe = {
  title: string
  image?: string
  prepTime?: string
  cookTime?: string
  totalTime?: string
  recipeYield?: string | number
  source?: string
  ingredients: Ingredient[]
  instructions: Instructions[]
}

export type RecipeParts = Partial<Recipe>
