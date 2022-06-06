import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Ingredient = {
  __typename?: 'Ingredient';
  normalized?: Maybe<Scalars['String']>;
  raw: Scalars['String'];
};

export type Instruction = {
  __typename?: 'Instruction';
  normalized?: Maybe<Scalars['String']>;
  raw: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a recipe from a URL to the user account. */
  addRecipe?: Maybe<Recipe>;
  /** Parse a recipe without a user account. */
  parseRecipe?: Maybe<Recipe>;
  /** Register a new user with a username and password. */
  register: User;
};


export type MutationAddRecipeArgs = {
  url: Scalars['String'];
};


export type MutationParseRecipeArgs = {
  url: Scalars['String'];
};


export type MutationRegisterArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** Fetch a single recipe by username and slug */
  recipe: Recipe;
  recipes: Array<Recipe>;
};


export type QueryRecipeArgs = {
  slug: Scalars['String'];
  username: Scalars['String'];
};

export type Recipe = {
  __typename?: 'Recipe';
  duration?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  image?: Maybe<Scalars['String']>;
  ingredients: Array<Ingredient>;
  instructions: Array<Instruction>;
  slug: Scalars['String'];
  source?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  yields?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  username: Scalars['String'];
};

export type RecipeQueryVariables = Exact<{
  username: Scalars['String'];
  slug: Scalars['String'];
}>;


export type RecipeQuery = { __typename?: 'Query', recipe: { __typename?: 'Recipe', title: string, image?: string | null, source?: string | null, duration?: number | null, yields?: string | null, ingredients: Array<{ __typename?: 'Ingredient', raw: string }>, instructions: Array<{ __typename?: 'Instruction', raw: string }> } };

export type RecipesQueryVariables = Exact<{ [key: string]: never; }>;


export type RecipesQuery = { __typename?: 'Query', recipes: Array<{ __typename?: 'Recipe', slug: string, title: string, image?: string | null }> };

export type AddRecipeMutationVariables = Exact<{
  url: Scalars['String'];
}>;


export type AddRecipeMutation = { __typename?: 'Mutation', addRecipe?: { __typename?: 'Recipe', slug: string } | null };

export type ParseRecipeMutationVariables = Exact<{
  url: Scalars['String'];
}>;


export type ParseRecipeMutation = { __typename?: 'Mutation', parseRecipe?: { __typename?: 'Recipe', title: string, image?: string | null, source?: string | null, duration?: number | null, yields?: string | null, ingredients: Array<{ __typename?: 'Ingredient', raw: string }>, instructions: Array<{ __typename?: 'Instruction', raw: string }> } | null };


export const RecipeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Recipe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"yields"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw"}}]}},{"kind":"Field","name":{"kind":"Name","value":"instructions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw"}}]}}]}}]}}]} as unknown as DocumentNode<RecipeQuery, RecipeQueryVariables>;
export const RecipesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Recipes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<RecipesQuery, RecipesQueryVariables>;
export const AddRecipeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addRecipe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addRecipe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<AddRecipeMutation, AddRecipeMutationVariables>;
export const ParseRecipeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"parseRecipe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parseRecipe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"yields"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw"}}]}},{"kind":"Field","name":{"kind":"Name","value":"instructions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"raw"}}]}}]}}]}}]} as unknown as DocumentNode<ParseRecipeMutation, ParseRecipeMutationVariables>;