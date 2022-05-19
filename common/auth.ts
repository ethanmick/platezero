import cookie from 'js-cookie'
import nextCookie from 'next-cookies'
import Router from 'next/router'

export interface Authentication {
  token?: string
  refresh?: string
  user?: any
}

export const authenticated = async (token: string, refresh: string) => {
  cookie.set(
    'auth',
    JSON.stringify({ token, refresh }),
    process.env.cookie as any
  )
}

export const getAuth = (ctx: any = undefined): Authentication => {
  try {
    const { auth } = ctx ? nextCookie(ctx) : cookie.get()
    return JSON.parse(auth || '')
  } catch {
    return {}
  }
}

export const logout = () => {
  cookie.remove('auth')
  Router.push('/')
}
