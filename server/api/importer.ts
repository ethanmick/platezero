import * as express from 'express'
import { Import, ImportResult, ImportStatus } from '../shrimp/shrimp'
import { AuthenticatedRequest } from './user'
import { internalServerError } from '../errors'
import { Recipe } from '../../models/recipe'
import { S3 } from 'aws-sdk'
import fetch from 'node-fetch'
import * as prom from 'prom-client'
import { parse } from 'url'
import { HttpStatus } from '../../common/http-status'
import { config } from '../config'
import { size, toString } from 'lodash'
import { generate } from 'shortid'
import { parse as parseRecipe } from 'recipe-parser'
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = new S3()
const { slackHook } = config

const r = express.Router()

const urlImportCounter = new prom.Counter({
  name: 'platezero_url_imports_total',
  help: 'Total number of URLs imported',
  labelNames: ['hostname']
})
r.post('/url', async function importUrl(req: AuthenticatedRequest, res) {
  const parsed = parse(req.body.url)
  urlImportCounter.inc({ hostname: parsed.hostname })
  try {
    const recipe = await parseRecipe(req.body.url)
    recipe.source_url = req.body.url
    // TODO: if any issues, make github issue/slack
    const status =
      size(recipe.ingredient_lists) == 0 || size(recipe.procedure_lists) == 0
        ? HttpStatus.UnprocessableEntity
        : HttpStatus.Created
    return res
      .status(status)
      .json(
        status === HttpStatus.Created
          ? await Recipe.createNewRecipe(req.user.userId, recipe)
          : recipe
      )
  } catch (err) {
    // TODO: Export recipe error
    if (err.recipe) {
      return res.status(HttpStatus.UnprocessableEntity).json(err.recipe)
    }
    return internalServerError(res, err)
  }
})

const fileImportCounter = new prom.Counter({
  name: 'platezero_file_imports_total',
  help: 'Total number of URLs imported',
  labelNames: ['mimetype']
})
const fileSizeHistogram = new prom.Histogram({
  name: 'platezero_file_import_bytes',
  help: 'Imported file size in bytes',
  labelNames: ['mimetype'],
  buckets: [1000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000]
})
const filesPerUploadHistogram = new prom.Histogram({
  name: 'platezero_file_import_num_files',
  help: 'Number of files per upload',
  buckets: [0, 1, 2, 4, 8, 16, 32, 64]
})
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'com-platezero-recipes',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) =>
      cb(null, `${req.user.userId}/${generate()}-${file.originalname}`)
  })
})
r.post('/file', upload.array('file'), async function importFile(req: any, res) {
  filesPerUploadHistogram.observe(req.files.length)
  let recipe,
    text,
    httpStatus,
    accepted: ImportResult[] = []
  const results: ImportResult[] = []

  // Do NOT use a lambda-based loop here;
  // the lambda must be declared 'async' but
  // the iterator will not 'await' the result
  for (let i = 0; i < req.files.length; ++i) {
    const file = req.files[i]
    const mimetype = toString(file.mimetype)
    fileImportCounter.inc({ mimetype })
    fileSizeHistogram.observe({ mimetype }, file.size)
    results.push(await Import(file, req.user.userId))
  }

  if (results.length === 1) {
    const result = results[0]
    console.log(`\x1b[97mImporter: Import result: ${result.status}\x1b[0m`)
    switch (result.status) {
      case ImportStatus.Incomplete:
        recipe = result.recipe
        text = result.text
        httpStatus = HttpStatus.UnprocessableEntity
        break
      case ImportStatus.Imported:
        recipe = result.recipe
        httpStatus = HttpStatus.Created
        break
      default:
        accepted.push(result)
        httpStatus = HttpStatus.Accepted
        break
    }
  } else {
    accepted = results.filter(result => result.status === ImportStatus.Failed)
    httpStatus = HttpStatus.Accepted
  }

  if (slackHook && accepted.length) {
    notifySlack(req.user.username, accepted)
  }

  res.status(httpStatus).json({ recipe, text })
})

function notifySlack(user: any, results: ImportResult[]) {
  fetch(slackHook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: `${user.username} (id: ${user.userId}) uploaded ${
        results.length
      } recipes which could not be automatically imported. 
Find them here: https://s3.console.aws.amazon.com/s3/buckets/com-platezero-recipes/?region=us-east-1
\n ${results.map(r => r.file.originalname).join('\n')}`
    })
  })
}

export const importers = r