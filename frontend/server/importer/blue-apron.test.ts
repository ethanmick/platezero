import { BlueApronImporter } from './blue-apron'
import { readFileSync } from 'fs'

const recipe =
  'test/assets/blueapron/mexican-spiced-chicken-zucchini-rice-with-tomato-jalapeno-salsa.html'
const goudaBurgers =
  'test/assets/blueapron/smoked-gouda-burgers-with-caramelized-onion-carrot-fries.html'

test('Blue Apron importer exists', () => {
  expect(BlueApronImporter).toBeDefined()
})

describe('Blue Apron import recipe', () => {
  let importer: BlueApronImporter

  beforeEach(() => {
    importer = new BlueApronImporter('')
    importer.setup(readFileSync(recipe, { encoding: 'utf8' }))
  })

  test('get title', async () => {
    const title = await importer.getTitle()
    expect(title).toEqual('Mexican-Spiced Chicken & Zucchini Rice')
  })

  test('get subtitle', async () => {
    const subtitle = await importer.getSubtitle()
    expect(subtitle).toEqual('with Tomato & Jalapeño Salsa')
  })

  test('get yield', async () => {
    const yld = await importer.getYield()
    expect(yld).toEqual('2')
  })

  test('get preheats', async () => {
    // this recipe has preheats
    importer.setup(readFileSync(goudaBurgers, { encoding: 'utf8' }))
    const preheats = await importer.getPreheats()
    expect(preheats).toHaveLength(1)
    expect(preheats).toEqual([{ name: 'oven', temperature: '450', unit: 'F' }])
  })

  test('get ingredient lists', async () => {
    const list = await importer.getIngredientLists()
    expect(list).toHaveLength(1)
    expect(list[0].ingredients).toEqual([
      {
        name: 'Boneless, Skinless Chicken Breasts',
        quantity_numerator: 2,
        quantity_denominator: 1,
        preparation: undefined,
        optional: false,
        unit: undefined
      },
      {
        name: 'Jasmine Rice',
        quantity_numerator: 1,
        quantity_denominator: 2,
        preparation: undefined,
        optional: false,
        unit: 'c'
      },
      {
        name: 'Grape Or Cherry Tomatoes',
        quantity_numerator: 4,
        quantity_denominator: 1,
        preparation: undefined,
        optional: false,
        unit: 'oz'
      },
      {
        name: 'Scallions',
        quantity_numerator: 2,
        quantity_denominator: 1,
        preparation: undefined,
        optional: false,
        unit: undefined
      },
      {
        name: 'Zucchini',
        quantity_numerator: 1,
        quantity_denominator: 1,
        preparation: undefined,
        optional: false,
        unit: undefined
      },
      {
        name: 'Rice Vinegar',
        quantity_numerator: 1,
        quantity_denominator: 1,
        preparation: undefined,
        optional: false,
        unit: 'tbsp'
      },
      {
        name: 'Sliced Pickled Jalapeño Pepper',
        quantity_numerator: 1,
        quantity_denominator: 1,
        preparation: undefined,
        optional: false,
        unit: 'oz'
      },
      {
        name: 'Fromage Blanc',
        quantity_numerator: 2,
        quantity_denominator: 1,
        preparation: undefined,
        optional: false,
        unit: 'tbsp'
      },
      {
        name:
          'Mexican Spice Blend (Ancho Chile Powder, Smoked Paprika, Garlic Powder, Ground Cumin & Dried Mexican Oregano)',
        quantity_numerator: 1,
        quantity_denominator: 1,
        preparation: undefined,
        optional: false,
        unit: 'tbsp'
      }
    ])
  })

  test('get procedure lists', async () => {
    const procedures = await importer.getProcedureLists()
    expect(procedures).toHaveLength(1)
    expect(procedures[0].name).toEqual('Instructions')
    expect(procedures[0].steps).toHaveLength(5)
    expect(procedures[0].steps[0]).toEqual({
      image_url:
        'https://media.blueapron.com/recipes/21409/recipe_steps/32374/1548270543-426-0028-6520/Jasmine_2P_Stockpot-Medium_Fluff_WEB_high_feature.jpg',
      title: 'Cook the rice:',
      text:
        'In a medium pot, combine the **rice**,** a pinch of salt**, and **1 cup of water**. Heat to boiling on high. Once boiling, reduce the heat to low. Cover and cook, without stirring, 12 to 14 minutes, or until the water has been absorbed and the rice is tender. Turn off the heat and fluff with a fork. Cover to keep warm.'
    })
  })
})