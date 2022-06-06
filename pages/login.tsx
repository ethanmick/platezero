import { ExclamationIcon } from '@heroicons/react/solid'
import { Button, Logo } from 'components'
import { Routes } from 'lib'
import type { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  username: string
  password: string
}

const Login: NextPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [error, setError] = useState('')
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async ({ username, password }: FormData) => {
    try {
      const res: any = await signIn('credentials', {
        redirect: false,
        username,
        password,
      })
      if (res?.error) {
        setError('Incorrect username or password')
        return
      }
    } catch (err: any) {
      setError(err?.message || 'Incorrect username or password')
    }
  }

  useEffect(() => {
    if (session?.user.name) {
      router.push({
        pathname: Routes.User,
        query: {
          username: session.user.name,
        },
      })
    }
  }, [router, session])

  return (
    <>
      <Head>
        <title>Sign in to PlateZero</title>
      </Head>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Logo className="text-3xl" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    {...register('username')}
                    id="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    {...register('password')}
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  />
                </div>
              </div>
              {error && (
                <div className="text-red-600 flex items-center">
                  <ExclamationIcon className="h-5 w-5" />
                  <span className="ml-2 text-sm">{error}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    defaultChecked={true}
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-sky-600 hover:text-sky-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <Button className="w-full justify-center text-sm" type="submit">
                  Sign in
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
