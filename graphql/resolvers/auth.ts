import { ContextAuthUser } from 'graphql/context'

export const requireUser = (
  user: ContextAuthUser | undefined
): ContextAuthUser => {
  if (!user?.id) {
    throw new Error('Unauthorized')
  }
  return user
}
