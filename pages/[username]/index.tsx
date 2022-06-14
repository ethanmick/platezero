import { gql } from '@apollo/client'
import { Header, Main } from 'components'
import { query } from 'lib/apollo'
import { RecipesQuery } from 'lib/generated'
import type { GetServerSidePropsContext, NextPage } from 'next'
import { InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

const recipeQuery = gql`
  query Recipes {
    recipes {
      slug
      title
      image
    }
  }
`

type RecipeCardProps = {
  title: string
  slug: string
  image?: string | null
}

const RecipeCard = ({ title, slug, image }: RecipeCardProps) => {
  const router = useRouter()
  return (
    <li>
      <Link href={`${router.asPath}/${slug}`}>
        <a className="flex py-2">
          <div className="mr-3">
            {image && (
              <Image
                className="rounded"
                src={image}
                width={72}
                height={72}
                alt={title}
                objectFit="cover"
              />
            )}
          </div>
          <div className="text-base font-semibold">{title}</div>
        </a>
      </Link>
    </li>
  )
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const UserPage: NextPage<Props> = ({ recipes }) => {
  const router = useRouter()
  return (
    <>
      <Header />
      <Main>
        <h1 className="text-3xl mt-4 mb-2 font-semibold">Recipes</h1>
        <ul>
          {recipes.map((r) => (
            <RecipeCard {...r} key={r.slug} />
          ))}
        </ul>
      </Main>
    </>
  )
}

export default UserPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { data } = await query<RecipesQuery>(ctx, recipeQuery)
  return {
    props: {
      recipes: data.recipes,
    },
  }
}
