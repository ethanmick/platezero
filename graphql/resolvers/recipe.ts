import { Recipe } from '@prisma/client'
import ImageKit from 'imagekit'
import { MutationAddRecipeArgs, RecipeQueryVariables } from 'lib/generated'
import { parse } from 'lib/parse'
import { parse as parsePath } from 'path'
import slugify from 'slugify'
import { v4 as uuid } from 'uuid'
import { requireUser } from './auth'
import { FieldResolver } from './types'

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT || '',
})

export const recipes: FieldResolver = (_, __, ctx) => {
  return ctx.prisma.recipe.findMany({
    where: {
      userId: ctx.user?.id,
    },
  })
}

export const recipe: FieldResolver<never, RecipeQueryVariables> = (
  _,
  args,
  ctx
) => {
  return ctx.prisma.recipe.findFirst({
    where: {
      user: {
        username: args.username,
      },
      slug: args.slug,
    },
  })
}

const ingredients: FieldResolver<Recipe, never> = (recipe, _, ctx) => {
  return ctx.prisma.ingredient.findMany({
    where: {
      recipeId: recipe.id,
    },
  })
}

const instructions: FieldResolver<Recipe, never> = (recipe, _, ctx) => {
  return ctx.prisma.instruction.findMany({
    where: {
      recipeId: recipe.id,
    },
  })
}

export const recipeResolver = {
  ingredients,
  instructions,
}

//
// Mutations
//
export const addRecipe: FieldResolver<never, MutationAddRecipeArgs> = async (
  _,
  args,
  ctx
) => {
  const user = requireUser(ctx?.user)
  const res = await fetch(args.url)
  const recipe = await parse(await res.text())
  const slug = slugify(recipe.title, {
    lower: true,
  })

  const count = await ctx.prisma.recipe.count({
    where: {
      slug,
    },
  })

  if (recipe.image) {
    const file = recipe.image
    const { ext } = parsePath(recipe.image)
    const fileName = uuid() + ext
    const { url } = await imagekit.upload({
      file,
      fileName,
    })
    recipe.image = url
  }

  const slugWithCount = count > 0 ? `${slug}-${count + 1}` : slug
  const created = await ctx.prisma.recipe.create({
    data: {
      title: recipe.title,
      slug: slugWithCount,
      image: recipe.image,
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
}
