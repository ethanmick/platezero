// /graphql/context.ts
import { PrismaClient } from '@prisma/client'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../lib/prisma'

export type Context = {
  prisma: PrismaClient
  user: {
    id: number
  }
}

export async function createContext({
  req,
}: {
  req: NextApiRequest
}): Promise<Context> {
  const { user } = (await getSession({ req })) as any
  console.log('Graph QL Session data', user)
  return {
    prisma,
    user,
  }
}
