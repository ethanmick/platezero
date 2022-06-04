import {
  FractionLike,
  parseAmount,
  parseIngredient,
  parseUnit,
} from './ingredient'

test.each([
  // negative cases
  ['', null],
  [' ', null],
  ['not a number', null],
  ['½', { n: 1, d: 2 }], // positive cases
  ['1½', { n: 3, d: 2 }],
  ['1 ½', { n: 3, d: 2 }],
  ['5', { n: 5, d: 1 }],
  ['1 1/2', { n: 3, d: 2 }],
  ['1.7', { n: 17, d: 10 }],
  ['0.1', { n: 1, d: 10 }],
  ['.9', { n: 9, d: 10 }],
  ['¾', { n: 3, d: 4 }],
  ['&frac14;', { n: 1, d: 4 }],
  ['&frac13;', { n: 1, d: 3 }],
  ['1&frac12;', { n: 3, d: 2 }],
])('parse ingredient(%s)', (s: string, expected: FractionLike | null) => {
  const result = parseAmount(s)
  if (expected === null) {
    expect(result).toBeNull()
    return
  }
  expect({ n: result?.n, d: result?.d }).toEqual(expected)
})

test.each([
  ['t', 'tsp'],
  ['tsp', 'tsp'],
  ['teaspoon', 'tsp'],
  ['T', 'tbsp'],
  ['l', 'l'],
  ['liter', 'l'],
  ['litre', 'l'],
])('parse unit(%s)', (text, expected) => {
  expect(parseUnit(text)).toEqual(expected)
})

type IngredientTest = [
  number | undefined,
  number | undefined,
  string | undefined,
  string,
  string | undefined,
  boolean
]
describe.each([
  [undefined, [undefined, undefined, undefined, '', undefined, false]],
  ['', [undefined, undefined, undefined, '', undefined, false]],
  [
    '2 tablespoons fresh lemon juice',
    [2, 1, 'tbsp', 'fresh lemon juice', undefined, false],
  ],
  [
    '3 garlic cloves, roughly chopped',
    [3, 1, undefined, 'garlic cloves, roughly chopped', undefined, false],
  ],
  ['1 15-ounce can', [1, 1, undefined, '15-ounce can', undefined, false]],
  ['1/4 cup olive oil', [1, 4, 'c', 'olive oil', undefined, false]],
  [
    'salt and pepper',
    [undefined, undefined, undefined, 'salt and pepper', undefined, false],
  ],
  [
    '    1/2    tsp   garlic      --      minced     (optional)     ',
    [1, 2, 'tsp', 'garlic', 'minced', true],
  ],
  [
    'salt (optional)',
    [undefined, undefined, undefined, 'salt', undefined, true],
  ],
  [
    'garlic -- minced (optional)',
    [undefined, undefined, undefined, 'garlic', 'minced', true],
  ],
  [
    'garlic — minced (optional)',
    [undefined, undefined, undefined, 'garlic', 'minced', true],
  ],
  [
    'garlic – minced (optional)',
    [undefined, undefined, undefined, 'garlic', 'minced', true],
  ],
  [
    'garlic; minced (optional)',
    [undefined, undefined, undefined, 'garlic', 'minced', true],
  ],
  [
    'garlic;minced (optional)',
    [undefined, undefined, undefined, 'garlic', 'minced', true],
  ],
  [
    'garlic - minced (optional)',
    [undefined, undefined, undefined, 'garlic', 'minced', true],
  ],
  [
    'garlic - minced - finely (optional)',
    [undefined, undefined, undefined, 'garlic', 'minced - finely', true],
  ],
  [
    'garlic-minced (optional)',
    [undefined, undefined, undefined, 'garlic-minced', undefined, true],
  ],
  ['1⅔c garlic', [5, 3, 'c', 'garlic', undefined, false]],
  ['1 ⅔ c garlic', [5, 3, 'c', 'garlic', undefined, false]],
  ['1⅔ c garlic', [5, 3, 'c', 'garlic', undefined, false]],
  [
    '5.5oz tomato paste, sliced',
    [11, 2, 'oz', 'tomato paste, sliced', undefined, false],
  ],
  [
    '250g/9oz long grain or basmati rice',
    [250, 1, 'g', 'long grain or basmati rice', undefined, false],
  ],
  [
    '600ml/20fl oz chicken stock',
    [600, 1, 'ml', 'oz chicken stock', undefined, false],
  ],
  [
    '500g/1lb 2oz skinless, boneless chicken thighs, cut into bite-sized pieces',
    [
      500,
      1,
      'g',
      '2oz skinless, boneless chicken thighs, cut into bite-sized pieces',
      undefined,
      false,
    ],
  ],
  ['1&frac12; teaspoons salt', [3, 2, 'tsp', 'salt', undefined, false]],
  // [
  //   '1&frac12; to 1&frac34; pounds chicken tenderloins or boneless, skinless chicken breasts',
  //   [3, 2, 'lb', 'chicken tenderloins or boneless', '', false],
  // ],
] as [string, IngredientTest][])(
  'parseIngredient(%s)',
  (text: string, [n, d, unit, name, prep, optional]) => {
    const result = parseIngredient(text)
    test(`has numerator ${n}`, () => {
      expect(result.quantity_numerator).toEqual(n)
    })
    test(`has denominator ${d}`, () => {
      expect(result.quantity_denominator).toEqual(d)
    })
    test(`has unit ${unit}`, () => {
      expect(result.unit).toEqual(unit)
    })
    test(`has name ${name}`, () => {
      expect(result.name).toEqual(name)
    })
    test(`has preparation ${prep}`, () => {
      expect(result.preparation).toEqual(prep)
    })
    test(optional ? 'is optional' : 'is not optional', () => {
      expect(result.optional).toEqual(optional)
    })
  }
)
