import {
  addRecipe,
  parseRecipe,
  recipe,
  recipeResolver,
  recipes,
} from './recipe'
import { register } from './user'

export const resolvers = {
  Query: {
    recipes,
    recipe,
  },
  Recipe: recipeResolver,
  Mutation: {
    register,
    addRecipe,
    parseRecipe,
  },
}
