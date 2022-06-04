import { gql } from '@apollo/client'
import { ChartPieIcon, ClockIcon } from '@heroicons/react/outline'
import { Header, Main } from 'components'
import { formatDuration } from 'date-fns'
import Fraction from 'fraction.js'
import { query } from 'lib/apollo'
import { RecipeQuery, RecipeQueryVariables } from 'lib/generated'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'

/* eslint-disable @next/next/no-img-element */

const recipeQuery = gql`
  query Recipe($username: String!, $slug: String!) {
    recipe(username: $username, slug: $slug) {
      title
      image
      source
      duration
      yields
      ingredients {
        name
        quantityNumerator
        quantityDenominator
        preparation
        unit
        optional
      }
      instructions {
        text
      }
    }
  }
`

const Title = ({ title }: { title: string }) => (
  <h1 className="text-2xl font-semibold">{title}</h1>
)

const URLSource = ({ source }: { source: string }) => {
  const { hostname } = new URL(source)
  const clean = hostname.replace('www.', '')
  return (
    <a className="hover:underline" href={source}>
      {clean}
    </a>
  )
}

const Source = ({ source }: { source: string }) => {
  const child = source.startsWith('http') ? (
    <URLSource source={source} />
  ) : (
    source
  )
  return <h2 className="text-sm text-neutral-500">{child}</h2>
}

const Time = ({ duration }: { duration: number }) => {
  const dur = formatDuration({ seconds: duration })
  return (
    <div className="flex items-center">
      <ClockIcon className="h-6 w-6" />
      <span className="ml-2">{dur}</span>
    </div>
  )
}

const Yield = ({ yields }: { yields: string }) => (
  <div className="flex items-center">
    <ChartPieIcon className="h-6 w-6" />
    <span className="ml-2">{yields}</span>
  </div>
)

type IngredientProps = {
  name: string
  quantityNumerator?: number | null
  quantityDenominator?: number | null
  preparation?: string | null
  unit?: string | null
  optional?: boolean | null
}

const Ingredient = ({
  name,
  quantityDenominator,
  quantityNumerator,
  preparation,
  unit,
  optional,
}: IngredientProps) => {
  const quantity =
    quantityNumerator && quantityDenominator
      ? new Fraction(quantityNumerator, quantityDenominator)
      : null
  return (
    <li className="py-2">
      {quantity ? quantity.toFraction() : null} {unit} {name} {preparation}{' '}
      {optional === true ? `(optional)` : null}
    </li>
  )
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const RecipePage: NextPage<Props> = ({ recipe }) => {
  return (
    <>
      <Header />
      <Main className="max-w-screen-lg mt-8">
        <div className="flex">
          <img
            className="w-full md:w-72 h-72 object-cover rounded-xl"
            src={recipe.image || ''}
            alt={recipe.title}
          />
          <div className="ml-4">
            <Title title={recipe.title} />
            {recipe.source && <Source source={recipe.source} />}
            <div className="mt-6 flex gap-8">
              {recipe.duration && recipe.duration > 0 && (
                <Time duration={recipe.duration} />
              )}
              {recipe.yields && <Yield yields={recipe.yields} />}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 mt-8 gap-8">
          <div>
            <h2 className="text-2xl font-semibold my-2">Ingredients</h2>
            <ul className="divide-y divide-neutral-100">
              {recipe.ingredients.map((ing, key) => (
                <Ingredient {...ing} key={key} />
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold my-2">Instructions</h2>
            <ol className="space-y-4 list-decimal">
              {recipe.instructions.map(({ text }, key) => (
                <li className="" key={key}>
                  {text}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Main>
    </>
  )
}

export default RecipePage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { username, slug } = ctx.params as any
  const { data } = await query<RecipeQuery, RecipeQueryVariables>(
    ctx,
    recipeQuery,
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
