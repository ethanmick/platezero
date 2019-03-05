import * as express from 'express'
import { Request } from 'express'
import * as _ from 'lodash'

import { User } from '../../../../models/user'
import { Recipe } from '../../../../models/recipe'
import { RecipeVersion } from '../../../../models/recipe_version'
import { RecipeBranch } from '../../../../models/recipe_branch'
import { RecipeYield } from '../../../../models/recipe_yield'
import { ProcedureList } from '../../../../models/procedure_list'
import { ProcedureLine } from '../../../../models/procedure_line'
import { Preheat } from '../../../../models/preheat'

const r = express.Router()

export interface RecipeRequest extends Request {
  user: User
  recipe: Recipe
}

r.get('/', async (req: RecipeRequest, res) => {
  res.json(
    await req.recipe.reload({
      include: [
        {
          model: RecipeBranch,
          attributes: ['name', 'recipe_version_id']
        },
        { model: User }
      ]
    })
  )
})

r.get('/versions/:id', async (req: RecipeRequest, res) => {
  const id = parseInt(req.params.id, 10)
  try {
    const recipeVersion = await RecipeVersion.findOne({
      where: { id, recipe_id: req.recipe.id },
      attributes: ['created_at', 'message'],
      order: [
        RecipeVersion.sequelize.literal(
          '"procedureLists.RecipeVersionProcedureList.sort_key" ASC'
        ),
        RecipeVersion.sequelize.literal(
          '"procedureLists.lines.ProcedureListLine.sort_key" ASC'
        )
      ],
      include: [
        { model: Recipe },
        { model: User },
        { model: RecipeYield, attributes: ['text'] },
        {
          model: Preheat,
          attributes: ['name', 'temperature', 'unit'],
          through: { attributes: [] }
        },
        {
          model: ProcedureList,
          attributes: ['name'],
          through: { attributes: [] },
          include: [
            {
              model: ProcedureLine,
              attributes: ['text'],
              through: { attributes: [] }
            }
          ]
        }
      ]
    })
    if (!recipeVersion) {
      res.status(404)
      return res.json({ error: 'not found' })
    }
    return res.json(recipeVersion)
  } catch (error) {
    res.status(500)
    return res.json({ error })
  }
})

export const recipe = r
