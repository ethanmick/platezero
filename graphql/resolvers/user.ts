import { hash } from 'bcrypt'
import { MutationRegisterArgs, User as RegisterOutput } from 'lib/generated'
import { FieldResolver } from './types'

export const register: FieldResolver<
  any,
  MutationRegisterArgs,
  RegisterOutput
> = async (_, args, ctx) => {
  const password = await hash(
    args.password,
    process.env.BCRYPT_SALT_ROUNDS || 12
  )
  return ctx.prisma.user.create({
    data: {
      username: args.username,
      password,
    },
  })
}
