import { parse } from 'lib/parse'
import { Context } from './context'

type AddRecipe = {
  url: string
}

export const resolvers = {
  Query: {
    recipes: (_parent: never, _args: any, ctx: Context) => {
      console.log('GET RECIPES')
      return ctx.prisma.recipe.findMany({
        where: {
          userId: ctx.user?.id,
        },
      })
    },
  },
  Mutation: {
    addRecipe: async (_parent: never, args: AddRecipe, ctx: Context) => {
      console.log('Add Recipe', args)
      const res = await fetch(args.url)
      const recipe = await parse(await res.text())
      return recipe
    },
  },
}
