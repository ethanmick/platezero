import { Context } from './context'

export const resolvers = {
  Query: {
    recipes: (_parent: never, _args: any, ctx: Context) => {
      console.log('GET RECIPES')
      return ctx.prisma.recipe.findMany({
        where: {
          userId: ctx.user.id,
        },
      })
    },
  },
}
