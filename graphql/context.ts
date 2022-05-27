// /graphql/context.ts
import { PrismaClient } from '@prisma/client'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../lib/prisma'

export type ContextAuthUser = {
  id: number
}

export type Context = {
  prisma: PrismaClient
  user?: ContextAuthUser
}

export async function createContext({
  req,
}: {
  req: NextApiRequest
}): Promise<Context> {
  const data = await getSession({ req })
  return {
    prisma,
    user: data?.user,
  }
}
