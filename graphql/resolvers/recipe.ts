import * as duration from 'duration-fns'
import ImageKit from 'imagekit'
import {
  MutationAddRecipeArgs,
  MutationParseRecipeArgs,
  Recipe as RecipeGraphQL,
  RecipeQueryVariables,
} from 'lib/generated'
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

const ingredients: FieldResolver<RecipeGraphQL> = (recipe, _, ctx) => {
  return recipe.id
    ? ctx.prisma.ingredient.findMany({
        where: {
          recipeId: recipe.id,
        },
      })
    : Promise.resolve(recipe.ingredients)
}

const instructions: FieldResolver<RecipeGraphQL> = (recipe, _, ctx) => {
  return recipe.id
    ? ctx.prisma.instruction.findMany({
        where: {
          recipeId: recipe.id,
        },
      })
    : Promise.resolve(recipe.instructions)
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
  recipe.source = args.url
  const slug = slugify(recipe.title, {
    remove: /[\(\)\$\&]/,
    lower: true,
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
  const time = duration.parse(recipe.totalTime || '')

  let count = 0
  while (count < 100) {
    const slugWithCount = count > 0 ? `${slug}-${count + 1}` : slug
    try {
      const created = await ctx.prisma.recipe.create({
        data: {
          title: recipe.title,
          slug: slugWithCount,
          image: recipe.image,
          source: recipe.source,
          yields: recipe.recipeYield ? `${recipe.recipeYield}` : undefined,
          duration: duration.toSeconds(time),
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
    } catch (err: any) {
      console.error(err)
      if (err.code === 'P2002' && err.meta?.target?.includes('slug')) {
        count++
        continue
      }
      throw err
    }
  }
}

export const parseRecipe: FieldResolver<
  never,
  MutationParseRecipeArgs
> = async (_, { url }) => {
  const res = await fetch(url)
  const recipe = await parse(await res.text())
  recipe.source = url

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
  const time = duration.parse(recipe.totalTime || '')

  console.log('Parse recipe!', recipe)

  console.log(
    'OKAY WTF',

    {
      title: recipe.title,
      slug: undefined,
      image: recipe.image,
      source: recipe.source,
      yields: recipe.recipeYield ? `${recipe.recipeYield}` : undefined,
      duration: duration.toSeconds(time),
      ingredients: recipe.ingredients.map((ing) => ({
        name: ing.name,
        quantityNumerator: ing.quantity_numerator,
        quantityDenominator: ing.quantity_denominator,
        unit: ing.unit,
        preparation: ing.preparation,
        optional: ing.optional,
      })),
      instructions: recipe.instructions,
    }
  )

  return {
    title: recipe.title,
    slug: undefined,
    image: recipe.image,
    source: recipe.source,
    yields: recipe.recipeYield ? `${recipe.recipeYield}` : undefined,
    duration: duration.toSeconds(time),
    ingredients: recipe.ingredients.map((ing) => ({
      name: ing.name,
      quantityNumerator: ing.quantity_numerator,
      quantityDenominator: ing.quantity_denominator,
      unit: ing.unit,
      preparation: ing.preparation,
      optional: ing.optional,
    })),
    instructions: recipe.instructions,
  }
}