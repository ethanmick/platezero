/* eslint-disable @next/next/no-img-element */
import { ChartPieIcon, ClockIcon } from '@heroicons/react/outline'
import { formatDuration } from 'date-fns'
import Fraction from 'fraction.js'
import { Recipe as RecipeModel } from 'lib/generated'

export const Title = ({ title }: { title: string }) => (
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

export const Source = ({ source }: { source: string }) => {
  const child = source.startsWith('http') ? (
    <URLSource source={source} />
  ) : (
    source
  )
  return <h2 className="text-sm text-neutral-500">{child}</h2>
}

export const Time = ({ duration }: { duration: number }) => {
  const dur = formatDuration({ seconds: duration })
  return (
    <div className="flex items-center">
      <ClockIcon className="h-6 w-6" />
      <span className="ml-2">{dur}</span>
    </div>
  )
}

export const Yield = ({ yields }: { yields: string }) => (
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

export const Ingredient = ({
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

type ViewableRecipe = Omit<RecipeModel, 'slug' | 'id'>

export type RecipeProps = {
  recipe: ViewableRecipe
}

export const Recipe = ({ recipe }: RecipeProps) => {
  return (
    <>
      <div className="flex flex-wrap">
        <img
          className="w-full md:w-72 h-72 object-cover rounded-xl mb-4"
          src={recipe.image || ''}
          alt={recipe.title}
        />
        <div className="md:ml-4">
          <Title title={recipe.title} />
          {recipe.source && <Source source={recipe.source} />}
          <div className="mt-4 flex gap-8">
            {recipe.duration && recipe.duration > 0 && (
              <Time duration={recipe.duration} />
            )}
            {recipe.yields && <Yield yields={recipe.yields} />}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-8">
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
          <ol className="space-y-4 list-decimal pl-4">
            {recipe.instructions.map(({ text }, key) => (
              <li className="" key={key}>
                {text}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  )
}
