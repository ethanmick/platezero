import { gql, useMutation } from '@apollo/client'
import { Button, FormTextarea, Header, Main } from 'components'
import { FormInput } from 'components/input'
import { Routes } from 'lib'
import { query } from 'lib/apollo'
import {
  RecipeForUpdateQuery,
  RecipeForUpdateQueryVariables,
  UpdateRecipeMutation,
  UpdateRecipeMutationVariables,
} from 'lib/generated'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

const fetchForUpdateQuery = gql`
  query RecipeForUpdate($username: String!, $slug: String!) {
    recipe(username: $username, slug: $slug) {
      id
      title
      image
      source
      duration
      yields
      ingredients {
        raw
      }
      instructions {
        raw
      }
    }
  }
`

const updateMutation = gql`
  mutation UpdateRecipe($recipe: RecipeInput!) {
    updateRecipe(recipe: $recipe) {
      slug
    }
  }
`

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

type FormData = {
  title: string
  source?: string
  ingredients: string
  instructions: string
}

const EditRecipe: NextPage<Props> = ({ recipe: initial }) => {
  const router = useRouter()
  const { username } = router.query
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      title: initial.title || '',
      source: initial.source || '',
      ingredients: initial.ingredients.map(({ raw }) => raw).join('\n'),
      instructions: initial.instructions.map(({ raw }) => raw).join('\n'),
    },
  })

  const [updateRecipe] = useMutation<
    UpdateRecipeMutation,
    UpdateRecipeMutationVariables
  >(updateMutation)

  const onSubmit = async (recipe: FormData) => {
    try {
      const { data } = await updateRecipe({
        variables: {
          recipe: {
            id: initial.id,
            ...recipe,
            ingredients: recipe.ingredients.split('\n').map((raw) => ({ raw })),
            instructions: recipe.instructions
              .split('\n')
              .map((raw) => ({ raw })),
          },
        },
      })
      router.push({
        pathname: Routes.Recipe,
        query: {
          username,
          slug: data?.updateRecipe.slug,
        },
      })
    } catch {}
  }

  return (
    <>
      <Header />
      <Main className="mt-8">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
          <FormInput {...register('title')} type="text" label="Title" />
          {/* <FormInput {...register('source')} type="text" label="Source" /> */}
          <FormTextarea
            {...register('ingredients')}
            label="Ingredients"
            rows={20}
          />
          <FormTextarea
            {...register('instructions')}
            label="Instructions"
            rows={20}
          />
          <Button type="submit">Save</Button>
        </form>
      </Main>
    </>
  )
}

export default EditRecipe

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { username, slug } = ctx.params as any
  const { data } = await query<
    RecipeForUpdateQuery,
    RecipeForUpdateQueryVariables
  >(ctx, fetchForUpdateQuery, {
    username,
    slug,
  })
  return {
    props: {
      recipe: data.recipe,
    },
  }
}
