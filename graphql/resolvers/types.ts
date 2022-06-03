import { GraphQLResolveInfo } from 'graphql'
import { Context } from 'graphql/context'

export type FieldResolver<
  Source = any,
  Args = Record<string, any>,
  Return = any
> = (
  source: Source,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Return>
