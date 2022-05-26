import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type Query {
    recipes: [Recipe!]!
  }

  type Mutation {
    addRecipe(url: String!): Recipe
  }

  type Recipe {
    id: Int!
    slug: String!
    title: String!
    image: String
    source: String
    duration: Int
    yields: String
    ingredients: [Ingredient!]!
    instructions: [Instruction!]!
  }

  type Ingredient {
    name: String!
    quantityNumerator: Int
    quantityDenominator: Int
    preparation: String
    unit: String
  }

  type Instruction {
    text: String!
  }
`
