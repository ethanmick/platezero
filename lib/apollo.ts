import { ApolloClient, DocumentNode, InMemoryCache } from '@apollo/client'
import { GetServerSidePropsContext } from 'next'
import { getToken } from 'next-auth/jwt'

const apolloClient = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_ROOT_URL}/api/graphql`,
  cache: new InMemoryCache(),
  credentials: 'include',
})

export default apolloClient

export const query = async <Query = any, Variables = any>(
  ctx: GetServerSidePropsContext,
  query: DocumentNode,
  variables?: Variables
) => {
  const token = await getToken({ req: ctx.req as any, raw: true })
  const apolloClient = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_ROOT_URL}/api/graphql`,
    cache: new InMemoryCache(),
    credentials: 'include',
    headers: {
      Authorization: token,
    },
  })

  return apolloClient.query<Query, Variables>({ query, variables })
}
