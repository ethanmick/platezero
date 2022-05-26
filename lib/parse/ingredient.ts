import Fraction from 'fraction.js'

export type FractionLike = {
  n?: number
  d?: number
}

export type Unit =
  | 'g'
  | 'mg'
  | 'kg'
  | 'oz'
  | 'lb'
  | 'qt'
  | 'c'
  | 'tbsp'
  | 'tsp'
  | 'l'
  | 'dl'
  | 'ml'
  | 'in'
  | 'ft'
  | 'cm'
  | 'm'

const fractionMapping: { [key: string]: string } = {
  '½': '1/2',
  '⅓': '1/3',
  '⅔': '2/3',
  '¼': '1/4',
  '¾': '3/4',
  '⅖': '2/5',
  '⅗': '3/5',
  '⅘': '4/5',
  '⅙': '1/6',
  '⅚': '5/6',
  '⅐': '1/7',
  '⅛': '1/8',
  '⅜': '3/8',
  '⅝': '5/8',
  '⅞': '7/8',
  '⅑': '1/9',
  '⅒': '1/10',
  '&frac12;': '1/2',
  '&frac13;': '1/3',
  '&frac23;': '2/3',
  '&frac14;': '1/4',
  '&frac34;': '3/4',
  '&frac25;': '2/5',
  '&frac35;': '3/5',
  '&frac45;': '4/5',
  '&frac16;': '1/6',
  '&frac56;': '5/6',
  '&frac17;': '1/7',
  '&frac18;': '1/8',
  '&frac38;': '3/8',
  '&frac58;': '5/8',
  '&frac78;': '7/8',
  '&frac19;': '1/9',
  '&frac110;': '1/10',
}

export const parseAmount = (input: string): FractionLike | null => {
  try {
    const s = input
      .replace(
        new RegExp(`(${Object.keys(fractionMapping).join('|')})`, 'gmi'),
        (m: string) => ` ${fractionMapping[m]}`
      )
      .replace(/\s\s+/, ' ')
      .trim()
    return new Fraction(s)
  } catch {
    return null
  }
}

export const parseUnit = (s?: string): Unit | undefined => {
  if (!s) {
    return undefined
  }
  if (s === 'T') {
    return 'tbsp'
  }

  // Some sites have amounts listed in two units, like:
  // 500g/1lb or 200g/7oz
  // If the `/` is present, break the unit on that and parse the first unit.
  if (s.includes('/')) {
    s = s.split('/')[0]
  }

  const unit = s.toLowerCase()
  switch (unit) {
    case 'oz':
    case 'g':
    case 'mg':
    case 'kg':
    case 'lb':
    case 'c':
    case 'qt':
    case 'tbsp':
    case 'tsp':
    case 'l':
    case 'dl':
    case 'ml':
    case 'in':
    case 'ft':
    case 'cm':
    case 'm':
      return unit
    case 'pound':
    case 'pounds':
    case 'lbs':
      return 'lb'
    case 'tablespoon':
    case 'tablespoons':
    case 'tbsps':
    case 'tbsp.':
      return 'tbsp'
    case 'teaspoon':
    case 'teaspoons':
    case 'tsps':
    case 'tsps.':
    case 'tsp.':
    case 't':
      return 'tsp'
    case 'cups':
    case 'cup':
    case 'cups.':
    case 'cup.':
      return 'c'
    case 'qts.':
    case 'qt.':
    case 'quart':
    case 'quarts':
      return 'qt'
    case 'litre':
    case 'liter':
      return 'l'
  }
}

export interface Ingredient {
  quantity_numerator?: number
  quantity_denominator?: number
  unit?: string
  name: string
  preparation?: string
  optional: boolean
}

// matchNumber returns a pair consisting of
// - a quantity, or { n: undefined, d: undefined } if not found, and
// - the remainder of the string to be parsed by subsequent logic
const matchNumber = (s: string): [FractionLike | null, string] => {
  // matches three general parts:
  // 1. the numerator or whole number or decimal
  // 2. a unicode fraction
  // 3. a fraction using / or just the denominator from (1)
  const p = /^(\s*\d*(\.\d+)?\s*([½⅓⅔¼¾⅖⅗⅘⅙⅚⅐⅛⅜⅝⅞⅑⅒]?)((\d*\s*)?\/\s*\d*)?)/gm
  const match = p.exec(s)
  if (match) {
    try {
      return [parseAmount(match[1]), s.substring(match[1].length)]
    } catch {
      // fall through to default
    }
  }
  return [null, s]
}

// figure out if s is an optional ingredient and return the string minus the
// "optional" part, as well as a boolean indicating whether optional was
// detected
function isOptional(s?: string): [string, boolean] {
  const optionalSuffix = '(optional)'
  if (!s) {
    return ['', false]
  }
  const str = s.trim()
  const optional = s.endsWith(optionalSuffix)
  if (optional) {
    const name = str.substring(0, str.length - optionalSuffix.length)
    return [name, true]
  }
  return [str, false]
}

// parse a string into an ingredient name, optionally followed by a preparation
function parsePrep(s?: string): [string, string | undefined] {
  if (!s) {
    return ['', undefined]
  }
  const parts = s.match(/(.+?)(?:--|;|–|—|\s-\s)(.+)/)
  if (!parts) {
    return [s.trim(), undefined]
  }
  const [_, ...rest] = parts
  const [name, prep] = rest
  return [name.trim(), prep.trim()]
}

export const parseIngredient = (s?: string): Ingredient => {
  const ing: Ingredient = {
    name: '',
    quantity_numerator: undefined,
    quantity_denominator: undefined,
    preparation: undefined,
    optional: false,
    unit: undefined,
  }
  if (!s) {
    return ing
  }
  s = s?.trim()
  const [num, numRest] = matchNumber(s)
  if (num) {
    ing.quantity_numerator = num.n
    ing.quantity_denominator = num.d
  }
  s = numRest.trim()
  const [maybeUnit, ...rest] = s.split(/\s/)
  const unit = parseUnit(maybeUnit)
  if (unit) {
    ing.unit = unit
    s = rest.join(' ')
  }
  const [str, optional] = isOptional(s)
  ing.optional = optional
  let [name, prep] = parsePrep(str)
  ing.name = name
  ing.preparation = prep
  return ing
}
