import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { compare } from 'bcrypt'
import prisma from 'lib/prisma'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }
        const user = await prisma.user.findFirst({
          where: {
            username: credentials.username,
          },
        })
        if (!user) {
          return null
        }
        const passwordCorrect = await compare(
          credentials.password,
          user?.password
        )
        if (!passwordCorrect) {
          return null
        }
        return {
          ...user,
          name: user.username,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: parseInt(token.sub || '', 10),
        },
      }
    },
  },
})
