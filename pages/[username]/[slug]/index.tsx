import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import {
  RecipeDocument,
  RecipeQuery,
  RecipeQueryVariables,
} from 'lib/generated'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'
import { getToken } from 'next-auth/jwt'

const query = gql`
  query Recipe($username: String!, $slug: String!) {
    recipe(username: $username, slug: $slug) {
      title
      ingredients {
        name
      }
      instructions {
        text
      }
    }
  }
`

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const RecipePage: NextPage<Props> = ({ recipe }) => {
  console.dir(recipe, { depth: null })
  return (
    <div>
      <h1 className="text-sm">recipe page</h1>
      <div>{recipe?.title}</div>
    </div>
  )
}

export default RecipePage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { username, slug } = ctx.params as any
  const token = await getToken({ req: ctx.req as any, raw: true })

  try {
    const apolloClient = new ApolloClient({
      uri: 'http://localhost:3000/api/graphql',
      cache: new InMemoryCache(),
      credentials: 'include',
      headers: {
        Authorization: token,
      },
    })

    const { data } = await apolloClient.query<
      RecipeQuery,
      RecipeQueryVariables
    >({
      query,
      variables: {
        username,
        slug,
      },
    })
    console.dir(data, { depth: null })

    return {
      props: {
        recipe: data.recipe,
      },
    }
  } catch (err: any) {
    console.dir(err, { depth: null })
    console.error(err)
    return {
      props: {
        error: err.message,
      },
    }
  }
}
