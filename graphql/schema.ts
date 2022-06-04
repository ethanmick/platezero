import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type Query {
    recipes: [Recipe!]!

    """
    Fetch a single recipe by username and slug
    """
    recipe(username: String!, slug: String!): Recipe!
  }

  type Mutation {
    """
    Register a new user with a username and password.
    """
    register(username: String!, password: String!): User!

    addRecipe(url: String!): Recipe
  }

  type User {
    username: String!
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
    optional: Boolean
  }

  type Instruction {
    text: String!
  }
`
