import { gql } from '@apollo/client'
import { Header, Main, Recipe } from 'components'
import { query } from 'lib/apollo'
import { RecipeQuery, RecipeQueryVariables } from 'lib/generated'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'

/* eslint-disable @next/next/no-img-element */

const recipeQuery = gql`
  query Recipe($username: String!, $slug: String!) {
    recipe(username: $username, slug: $slug) {
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

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const RecipePage: NextPage<Props> = ({ recipe }) => {
  return (
    <>
      <Header />
      <Main className="max-w-screen-lg mt-8">
        <Recipe recipe={recipe} />
      </Main>
    </>
  )
}

export default RecipePage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { username, slug } = ctx.params as any
  const { data } = await query<RecipeQuery, RecipeQueryVariables>(
    ctx,
    recipeQuery,
    {
      username,
      slug,
    }
  )
  return {
    props: {
      recipe: data.recipe,
    },
  }
}
