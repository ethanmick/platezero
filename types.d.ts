import 'next'
import 'next-auth'

// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id: string
//       name: string
//     }
//   }
// }

// declare module 'next' {
//   type AuthPage = NextPage & {
//     auth?: boolean
//   }
// }

declare global {
  var prisma: PrismaClient | undefined
}
