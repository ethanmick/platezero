import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { RecipesQuery } from 'lib/generated'
import type { GetServerSidePropsContext, NextPage } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { getToken } from 'next-auth/jwt'
import { useSession } from 'next-auth/react'

const query = gql`
  query Recipes {
    recipes {
      slug
      title
    }
  }
`

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const UserPage: NextPage<Props> = ({ recipes }: Props) => {
  const { data: user } = useSession()
  console.log('User', user)

  // const { data, loading, error } = useQuery(query)
  // console.log('DATA', data, error)

  return (
    <>
      <h1 className="text-sm">user page</h1>
      {recipes.map((r) => (
        <div key={r.slug}>{r.title}</div>
      ))}
    </>
  )
}

export default UserPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const token = await getToken({ req: ctx.req as any, raw: true })
  console.log('Got token', token)

  try {
    const apolloClient = new ApolloClient({
      uri: 'http://localhost:3000/api/graphql',
      cache: new InMemoryCache(),
      credentials: 'include',
      headers: {
        Authorization: token,
      },
    })

    const { data } = await apolloClient.query<RecipesQuery>({ query })
    console.log(' DID IT WORKKKKK Server Side props', data)

    return {
      props: {
        recipes: data.recipes,
      },
    }
  } catch (err: any) {
    console.error(err)
    return {
      props: {
        recipes: [],
        error: err.message,
      },
    }
  }
}
