import { gql, useQuery } from '@apollo/client'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'

const query = gql`
  query {
    recipes {
      slug
      title
    }
  }
`

const UserPage: NextPage = () => {
  const { data: user } = useSession()
  console.log('User', user)

  const { data, loading, error } = useQuery(query)

  console.log('DATA', data, error)

  return <h1 className="text-sm">user page</h1>
}

export default UserPage
