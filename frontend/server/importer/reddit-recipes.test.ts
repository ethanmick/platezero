import { RedditRecipes } from './reddit-recipes'
import { testAsset } from '../../test/readfile'

describe('r/recipes', () => {
  const importer = RedditRecipes

  describe('pasta_with_chicken_in_cream_sauce', () => {
    let result
    beforeAll(async () => {
      const source = JSON.parse(
        await testAsset(
          'www.reddit.com/r/recipes/pasta_with_chicken_in_cream_sauce.json'
        )
      )
      result = await importer(source)
    })

    test('title', () => {
      expect(result.title).toEqual('Pasta with chicken in cream sauce')
    })

    test.skip('ingredient_lists', () => {
      expect(result.ingredient_lists).toEqual([
        {
          lines: [
            {
              name:
                'Pasta 250 grams (i used long and wide ones, but you can use any you like. As alternatives i prefer tubes)',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'Chicken breast 250',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: '300 grams (8 - 11 ounces)',
              optional: false,
              unit: undefined
            },
            {
              name: 'Cream 35%',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: '200 ml (~ 7 fluid ounces)',
              optional: false,
              unit: undefined
            },
            {
              name: 'Cherry tomatoes ~12 pcs',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'Garlic',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: '1 clove',
              optional: false,
              unit: undefined
            },
            {
              name: 'Red bell pepper',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: '1 pc',
              optional: false,
              unit: undefined
            },
            {
              name: 'Dried Oregano',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: 'tea-spoon/pinch (to taste)',
              optional: false,
              unit: undefined
            },
            {
              name: 'Salt and pepper',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: 'to taste',
              optional: false,
              unit: undefined
            },
            {
              name: 'Yellow curry powder',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: 'tea-spoon',
              optional: false,
              unit: undefined
            }
          ]
        }
      ])
    })

    test.skip('procedure_lists', () => {
      expect(result.procedure_lists).toEqual([
        {
          lines: [
            { text: 'Slice chicken in small chops (like 1/2 inch)' },
            { text: 'Slice bell pepper in tiny bits (about 1/4 inch)' },
            { text: 'Cook pasta (according to its packaging)' },
            {
              text:
                'Put pan on low heat, add some olive oil, sliced chicken, curry powder and salt&pepper.'
            },
            {
              text: 'Stir while most of chicken is white, then add bell pepper.'
            },
            { text: 'Add half of prepared tomatoes each sliced in 4 peaces' },
            { text: 'Cook until chicken is cooked/done. Then add cream..' },
            {
              text:
                'When cream start to boil add other half of sliced tomatoes, minced garlic and pasta.'
            },
            {
              text:
                'Leave it to cool down a little, if you like you can add a little water to get it more saucy.'
            },
            { text: 'Done :)' }
          ]
        }
      ])
    })
  })

  describe('gracies_atomic_salad', () => {
    let result
    beforeEach(async () => {
      const source = JSON.parse(
        await testAsset('www.reddit.com/r/recipes/gracies_atomic_salad.json')
      )
      result = await importer(source)
    })

    test('title', () => {
      expect(result.title).toEqual("Gracie's Atomic Salad")
    })

    test('ingredient_lists', () => {
      expect(result.ingredient_lists).toEqual([
        {
          lines: [
            {
              name: 'can artichoke hearts',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: 'drained and quartered',
              optional: false,
              unit: undefined
            },
            {
              name: 'large avocado',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: 'cubed',
              optional: false,
              unit: undefined
            },
            {
              name: 'cubed fresh mozzarella',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'or 2 sliced green onions',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: 'green and white parts',
              optional: false,
              unit: undefined
            },
            {
              name: 'small can black olives',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: 'drained',
              optional: false,
              unit: undefined
            },
            {
              name: 'pint cherry tomatoes or 2 ripe tomatoes quartered',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'small red onion',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: 'in thin rings',
              optional: false,
              unit: undefined
            },
            {
              name: 'pepperoni',
              quantity_numerator: 8,
              quantity_denominator: 1,
              preparation: 'sliced - I use uncured now',
              optional: false,
              unit: 'oz'
            },
            {
              name: 'chopped fresh basil',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'heads Boston lettuce',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: 'tear the leaves',
              optional: false,
              unit: undefined
            },
            {
              name: '-2 cloves garlic minced',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'tbs red wine vinegar',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'Dijon mustard',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'olive oil',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'salt and pepper',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: undefined,
              optional: false,
              unit: undefined
            }
          ]
        }
      ])
    })

    test('procedure_lists', () => {
      expect(result.procedure_lists).toEqual([
        {
          lines: [
            {
              text:
                'Whisk garlic, vinegar, mustard, olive oil, salt and pepper in serving bowl for dressing.'
            },
            {
              text:
                'Add artichokes, olives, tomatoes, red onion and avocado to dressing. Mix well to coat and marinade for at least 1 hour or overnight.'
            },
            {
              text:
                'Add all other ingredients, except lettuce and toss well. Add lettuce and toss just before serving. Serve with french bread and lemonade or wine.'
            }
          ]
        }
      ])
    })
  })
})