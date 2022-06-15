import { Header } from 'components/header'
import { Routes } from 'lib'
import type { NextPage } from 'next'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

const Home: NextPage = () => {
  const { data: session } = useSession()

  return (
    <>
      <Header />
      <div>
        <h1 className="text-sm">home</h1>
        {!session && (
          <div>
            <Link href={Routes.Login}>
              <a>Login</a>
            </Link>
          </div>
        )}
        {session && (
          <div>
            <button onClick={() => signOut()}>Logout</button>
          </div>
        )}
        <Link href={{ pathname: Routes.Recipe }}>
          <a>Recipe</a>
        </Link>
      </div>
    </>
  )
}

export default Home
