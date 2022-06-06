import { ApolloProvider } from '@apollo/client'
import * as Fathom from 'fathom-client'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import apolloClient from '../lib/apollo'
import '../styles/index.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    Fathom.load('MFVTVFKC', {
      includedDomains: ['platezero.vercel.app', 'platezero.com'],
    })

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }
    router.events.on('routeChangeComplete', onRouteChangeComplete)
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ApolloProvider client={apolloClient}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ApolloProvider>
  )
}

export default MyApp
