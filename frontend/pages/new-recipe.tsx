import React from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { Layout } from '../components'
import { getUser, createRecipe } from '../common/http'
import { UserJSON, RecipeJSON } from '../models'
import { AmountInput, NewRecipeTitle } from '../components'
import nextCookie from 'next-cookies'
import * as _ from 'lodash'

type SimpleProperty =
  | 'title'
  | 'image_url'
  | 'source_url'
  | 'oven_preheat_temperature'

const nullIfFalsey = (o: any): any => {
  if (o === '') {
    return undefined
  } else if (o === 0) {
    return null
  } else if (_.isPlainObject(o)) {
    return _.mapValues(o, nullIfFalsey)
  } else if (_.isArray(o)) {
    return _.map(o, nullIfFalsey)
  }
  return o
}

interface NewRecipeProps {
  user: UserJSON
  token: string
}

export default class NewRecipe extends React.Component<
  NewRecipeProps,
  RecipeJSON
> {
  constructor(props: NewRecipeProps) {
    super(props)
    this.create = this.create.bind(this)
    this.ingredientOnChange = this.ingredientOnChange.bind(this)
    this.ingredientListNameChange = this.ingredientListNameChange.bind(this)
    this.stepOnChange = this.stepOnChange.bind(this)
    this.state = {
      title: '',
      image_url: '',
      source_url: '',
      yield: '',
      oven_preheat_temperature: 0,
      oven_preheat_unit: 'F',
      sous_vide_preheat_temperature: 0,
      sous_vide_preheat_unit: 'F',
      ingredient_lists: [
        {
          name: '',
          ingredients: [
            {
              quantity_numerator: 1,
              quantity_denominator: 1,
              name: '',
              preparation: '',
              optional: false
            }
          ]
        }
      ],
      procedure_lists: [
        {
          name: '',
          steps: ['']
        }
      ]
    }
  }
  static async getInitialProps(ctx) {
    const {
      query: { username }
    } = ctx
    const { token } = nextCookie(ctx)
    return {
      user: await getUser(username, { token }),
      token
    }
  }

  public titleOnChange = (e: React.FormEvent<HTMLInputElement>) =>
    this.setState({
      title: e.currentTarget.value
    })

  public async create(event: React.FormEvent<EventTarget>) {
    console.log('create!', this.state)
    console.log('token', this.props)
    const { token } = this.props
    event.preventDefault()
    const recipe = nullIfFalsey({ ...this.state })
    delete recipe.sous_vide_preheat_temperature
    console.log('Recipeeeee', recipe)
    try {
      const res = await createRecipe(recipe, { token })
      console.log('Created!', res)
    } catch (err) {
      console.log('ERROR CRREATIN RECIPE', err)
    }
  }

  public setField = (field: SimpleProperty, val: string) =>
    this.setState(state => ({
      ...state,
      ...{ [field]: val }
    }))

  public addIngredient = (i: number) => {
    this.setState(state => {
      const ingredients = state.ingredient_lists[i].ingredients
      ingredients.push({
        name: '',
        //        unit: '',
        quantity_numerator: 1,
        quantity_denominator: 1,
        preparation: '',
        optional: false
      })
      state.ingredient_lists[i].ingredients = ingredients
      return state
    })
  }

  public addProcedureStep = () => {
    console.log('add procedure step')
    this.setState(state => ({
      procedure_lists: [
        ...state.procedure_lists,
        {
          name: '',
          steps: ['']
        }
      ]
    }))
  }

  public ingredientOnChange(list: number, ingredient: number, val: string) {
    this.setState(state => {
      const ingredients = state.ingredient_lists[list].ingredients[ingredient]
      ingredients.name = val
      return state
    })
  }

  public ingredientListNameChange(i: number, val: string) {
    console.log('name change', i, val)
    this.setState(state => {
      console.log('state', i, state)
      const list = state.ingredient_lists[i]
      list.name = val
      return state
    })
  }

  public stepOnChange(listIndex: number, stepIndex: number, val: string) {
    this.setState(state => {
      state.procedure_lists[listIndex].steps[stepIndex] = val
      return state
    })
  }

  public procedureListNameChange(i: number, val: string) {
    this.setState(state => {
      state.procedure_lists[i].name = val
      return state
    })
  }

  public render() {
    return (
      <Layout user={this.props.user}>
        <Form onSubmit={this.create} className="mt-3">
          <NewRecipeTitle
            value={this.state.title}
            onChange={this.titleOnChange}
          />
          <h2>Ingredients</h2>
          {this.state.ingredient_lists.map((il, i) => (
            <Row key={i}>
              <Col xs="1">
                <FormGroup>
                  <Label for="ingredientQuantity" className="m-0">
                    <small>Amount</small>
                  </Label>
                  <AmountInput value={0} tabIndex={2 + i * 3} />
                </FormGroup>
              </Col>
              <Col xs="2">
                <FormGroup>
                  <Label for="ingredientMeasurement" className="m-0">
                    <small>Unit</small>
                  </Label>
                  <Input
                    type="text"
                    name="ingredientQuantity"
                    id="ingredientQuantity"
                    tabIndex={3 + i * 3}
                  />
                </FormGroup>
              </Col>
              <Col xs="2">
                <FormGroup>
                  <Label for="ingredientMeasurement" className="m-0">
                    <small>Name</small>
                  </Label>
                  <Input
                    type="text"
                    name="ingredientQuantity"
                    id="ingredientQuantity"
                    tabIndex={4 + i * 3}
                  />
                </FormGroup>
              </Col>
              <Col xs="6">
                {il.ingredients.map((ingred, j) => (
                  <FormGroup>
                    <Label for="ingredient" className="m-0">
                      <small>Preparation</small>
                    </Label>
                    <Input
                      key={j}
                      type="text"
                      value={ingred.name}
                      onChange={e =>
                        this.ingredientOnChange(i, j, e.currentTarget.value)
                      }
                    />
                  </FormGroup>
                ))}
              </Col>
              <Col xs="r">
                <FormGroup>
                  <Label for="ingredientMeasurement" className="m-0">
                    <small>Optional</small>
                  </Label>
                  <Input
                    type="checkbox"
                    name="ingredientQuantity"
                    id="ingredientQuantity"
                    tabIndex={4 + i * 3}
                  />
                </FormGroup>
              </Col>
            </Row>
          ))}
          <Button
            type="button"
            outline
            color="secondary "
            onClick={() => this.addIngredient(0)}
          >
            Add Another Ingredient
          </Button>
          <h2 className="my-3">Steps</h2>
          <Row>
            {this.state.procedure_lists.map((p, i) => (
              <Col key={i} xs="12" className="mb-3">
                {p.steps.map((_, j) => (
                  <Input
                    key={`pstep-${j}`}
                    type="textarea"
                    name="text"
                    id="exampleText"
                    placeholder="Step by step instructions..."
                    value={this.state.procedure_lists[i].steps[j]}
                    onChange={e =>
                      this.stepOnChange(i, j, e.currentTarget.value)
                    }
                  />
                ))}
              </Col>
            ))}
          </Row>
          <Button
            type="button"
            outline
            color="secondary"
            onClick={this.addProcedureStep}
          >
            Add Another Step
          </Button>
          <Button type="submit" color="primary" className="btn-block my-3">
            Create New Recipe!
          </Button>
        </Form>
      </Layout>
    )
  }
}
