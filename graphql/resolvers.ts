export const resolvers = {
  Query: {
    recipes: (_parent, _args, ctx) => {
      return ctx.prisma.recipe.findMany()
    }
  }
}
