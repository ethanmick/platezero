import { Recipe } from '@prisma/client'
import { MutationAddRecipeArgs, RecipeQueryVariables } from 'lib/generated'
import { parse } from 'lib/parse'
import slugify from 'slugify'
import { Context, ContextAuthUser } from './context'

const assertAuth = (user: ContextAuthUser | undefined): ContextAuthUser => {
  if (!user?.id) {
    throw new Error('Unauthorized')
  }
  return user
}

export const resolvers = {
  Query: {
    recipes: (_parent: never, _args: any, ctx: Context) => {
      return ctx.prisma.recipe.findMany({
        where: {
          userId: ctx.user?.id,
        },
      })
    },
    recipe: (_parent: never, args: RecipeQueryVariables, ctx: Context) => {
      return ctx.prisma.recipe.findFirst({
        where: {
          user: {
            username: args.username,
          },
          slug: args.slug,
        },
      })
    },
  },
  Recipe: {
    ingredients: (recipe: Recipe, _args: never, ctx: Context) => {
      return ctx.prisma.ingredient.findMany({
        where: {
          recipeId: recipe.id,
        },
      })
    },
    instructions: (recipe: Recipe, _args: never, ctx: Context) => {
      return ctx.prisma.instruction.findMany({
        where: {
          recipeId: recipe.id,
        },
      })
    },
  },
  Mutation: {
    addRecipe: async (_: never, args: MutationAddRecipeArgs, ctx: Context) => {
      const user = assertAuth(ctx?.user)
      const res = await fetch(args.url)
      const recipe = await parse(await res.text())
      const slug = slugify(recipe.title, {
        lower: true,
      })
      const created = await ctx.prisma.recipe.create({
        data: {
          title: recipe.title,
          slug: slug,
          userId: user.id,
          ingredients: {
            createMany: {
              data: recipe.ingredients.map((ing) => ({
                name: ing.name,
                quantityNumerator: ing.quantity_numerator,
                quantityDenominator: ing.quantity_denominator,
                unit: ing.unit,
                preparation: ing.preparation,
                optional: ing.optional,
              })),
            },
          },
          instructions: {
            create: recipe.instructions,
          },
        },
      })
      return created
    },
  },
}
