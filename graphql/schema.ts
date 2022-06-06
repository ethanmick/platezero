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

    """
    Add a recipe from a URL to the user account.
    """
    addRecipe(url: String!): Recipe

    """
    Parse a recipe without a user account.
    """
    parseRecipe(url: String!): Recipe
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
    raw: String!
    normalized: String
  }

  type Instruction {
    raw: String!
    normalized: String
  }
`
