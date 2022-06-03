import { gql, useMutation } from '@apollo/client'
import { Header, Main } from 'components'
import { Button } from 'components/button'
import { Routes } from 'lib'
import { AddRecipeMutation, AddRecipeMutationVariables } from 'lib/generated'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const mutation = gql`
  mutation addRecipe($url: String!) {
    addRecipe(url: $url) {
      slug
    }
  }
`

type FormData = {
  url: string
}

const Add: NextPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      url: '',
    },
  })

  const [addRecipe, { loading }] = useMutation<
    AddRecipeMutation,
    AddRecipeMutationVariables
  >(mutation, {
    onCompleted: (data) => {
      router.push({
        pathname: Routes.Recipe,
        query: {
          username: session?.user.name,
          slug: data.addRecipe?.slug,
        },
      })
    },
    onError: console.error,
  })

  const onSubmit: SubmitHandler<FormData> = ({ url }) => {
    addRecipe({
      variables: {
        url,
      },
    })
  }

  return (
    <>
      <Header />
      <Main>
        <form
          className="py-8 max-w-screen-sm mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="text-2xl font-light mb-4 block" htmlFor="url">
            Add a recipe from another website
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
              Add
            </Button>
          </div>
        </form>
      </Main>
    </>
  )
}

export default Add
