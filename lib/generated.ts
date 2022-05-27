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
  name: Scalars['String'];
  preparation?: Maybe<Scalars['String']>;
  quantityDenominator?: Maybe<Scalars['Int']>;
  quantityNumerator?: Maybe<Scalars['Int']>;
  unit?: Maybe<Scalars['String']>;
};

export type Instruction = {
  __typename?: 'Instruction';
  text: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addRecipe?: Maybe<Recipe>;
};


export type MutationAddRecipeArgs = {
  url: Scalars['String'];
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

export type RecipeQueryVariables = Exact<{
  username: Scalars['String'];
  slug: Scalars['String'];
}>;


export type RecipeQuery = { __typename?: 'Query', recipe: { __typename?: 'Recipe', title: string } };

export type RecipesQueryVariables = Exact<{ [key: string]: never; }>;


export type RecipesQuery = { __typename?: 'Query', recipes: Array<{ __typename?: 'Recipe', slug: string, title: string }> };

export type AddRecipeMutationVariables = Exact<{
  url: Scalars['String'];
}>;


export type AddRecipeMutation = { __typename?: 'Mutation', addRecipe?: { __typename?: 'Recipe', slug: string } | null };


export const RecipeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Recipe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<RecipeQuery, RecipeQueryVariables>;
export const RecipesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Recipes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<RecipesQuery, RecipesQueryVariables>;
export const AddRecipeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addRecipe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addRecipe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<AddRecipeMutation, AddRecipeMutationVariables>;