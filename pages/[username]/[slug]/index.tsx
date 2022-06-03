import { gql } from '@apollo/client'
import { Header, Main } from 'components'
import { query } from 'lib/apollo'
import { RecipeQuery, RecipeQueryVariables } from 'lib/generated'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'

const RecipeQuery = gql`
  query Recipe($username: String!, $slug: String!) {
    recipe(username: $username, slug: $slug) {
      title
      image
      ingredients {
        name
      }
      instructions {
        text
      }
    }
  }
`

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const RecipePage: NextPage<Props> = ({ recipe }) => {
  return (
    <>
      <Header />
      <Main>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-72 object-cover rounded"
          src={recipe.image || ''}
          alt={recipe.title}
        />
        <h1 className="text-2xl font-semibold">{recipe.title}</h1>
        <h2>from source</h2>
        <div>time</div>
        <div>yields</div>
        <h2 className="text-lg">Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ing, key) => (
            <li key={key}>{ing.name}</li>
          ))}
        </ul>
        <h2 className="text-lg">Instructions</h2>
        <ol>
          {recipe.instructions.map(({ text }, key) => (
            <li key={key}>{text}</li>
          ))}
        </ol>
      </Main>
    </>
  )
}

export default RecipePage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { username, slug } = ctx.params as any
  const { data } = await query<RecipeQuery, RecipeQueryVariables>(
    ctx,
    RecipeQuery,
    {
      username,
      slug,
    }
  )
  return {
    props: {
      recipe: data.recipe,
    },
  }
}
