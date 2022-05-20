// /graphql/context.ts
import { PrismaClient } from '@prisma/client'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../lib/prisma'

type User = {
  id: number
}

export type Context = {
  prisma: PrismaClient
  user?: User
}

export async function createContext({
  req,
}: {
  req: NextApiRequest
}): Promise<Context> {
  console.log('Create context')
  const data = await getSession({ req })
  console.log('Graph QL Session data', data)
  return {
    prisma,
    user: data?.user,
  }
}
