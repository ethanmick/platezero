import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type Query {
    recipes: [Recipe!]!
  }

  type Recipe {
    id: Int!
    slug: String!
    title: String!
    image: String
    source: String
    duration: Int
    yields: String
  }
`
