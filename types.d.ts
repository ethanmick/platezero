import 'next'
import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: number
      name: string
    }
  }
}

declare global {
  var prisma: PrismaClient | undefined
}
