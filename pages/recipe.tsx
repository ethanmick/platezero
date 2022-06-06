import {
  DefaultContext,
  gql,
  MutationFunctionOptions,
  useMutation,
} from '@apollo/client'
import { Header, Main, Recipe } from 'components'
import { Button } from 'components/button'
import {
  Exact,
  ParseRecipeMutation,
  ParseRecipeMutationVariables,
} from 'lib/generated'
import type { NextPage } from 'next'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const mutation = gql`
  mutation parseRecipe($url: String!) {
    parseRecipe(url: $url) {
      title
      image
      source
      duration
      yields
      ingredients {
        normalized
      }
      instructions {
        normalized
      }
    }
  }
`

type FormData = {
  url: string
}

type ParseRecipeFormProps = {
  loading?: boolean
  parseRecipe: (
    options?: MutationFunctionOptions<
      ParseRecipeMutation,
      Exact<{
        url: string
      }>,
      DefaultContext
    >
  ) => Promise<any>
}

const ParseRecipeForm = ({ parseRecipe, loading }: ParseRecipeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      url: '',
    },
  })

  const onSubmit: SubmitHandler<FormData> = ({ url }) => {
    parseRecipe({
      variables: {
        url,
      },
    })
  }
  return (
    <form
      className="py-8 max-w-screen-sm mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label className="text-2xl font-light mb-4 block" htmlFor="url">
        Get the recipe from another website
      </label>
      <div className="relative">
        <input
          {...register('url', { required: true })}
          autoFocus
          className="text-xl leading-10 border w-full rounded-full pl-4 pr-20"
          placeholder="https://myfavoriterecipes.com/recipe"
        />
        <Button
          type="submit"
          disabled={!isValid || loading}
          className="absolute right-0 rounded-l-none"
        >
          Get Recipe
        </Button>
      </div>
    </form>
  )
}

const RecipePage: NextPage = () => {
  const [parseRecipe, { data: recipe, loading }] = useMutation<
    ParseRecipeMutation,
    ParseRecipeMutationVariables
  >(mutation, {
    onError: console.error,
  })

  return (
    <>
      <Header />
      <Main className="max-w-screen-lg md:mt-8">
        {!recipe && (
          <ParseRecipeForm loading={loading} parseRecipe={parseRecipe} />
        )}
        {recipe?.parseRecipe && <Recipe recipe={recipe.parseRecipe} />}
      </Main>
    </>
  )
}

export default RecipePage
