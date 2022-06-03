import { Routes } from 'lib'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ButtonLink } from './button'

const Logo = () => (
  <Link href={Routes.Home}>
    <a>
      <span className="text-2xl font-light text-sky-500">PlateZero</span>
    </a>
  </Link>
)

export const Header = () => {
  const { data: session } = useSession()
  return (
    <header className="border-b">
      <div className="container px-2 mx-auto py-4 flex items-center">
        <Logo />
        <nav className="ml-4">
          <Link
            href={{
              pathname: Routes.User,
              query: {
                username: session?.user.name,
              },
            }}
          >
            <a>Your Recipes</a>
          </Link>
        </nav>
        <span className="flex-grow" />
        <div className="flex gap-2">
          {session ? (
            <ButtonLink href={Routes.Add}>Add</ButtonLink>
          ) : (
            <>
              <ButtonLink href={Routes.Login}>Sign in</ButtonLink>
              <ButtonLink href={Routes.Register}>Sign up</ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
