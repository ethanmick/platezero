const nextroutes = require('next-routes')

export const routes: any = nextroutes()
  .add('login')
  .add('register')
  .add('user', '/:username')
  .add('user-recipe', '/:username/recipes', 'user')
  .add('new-recipe', '/:username/recipe/new')
  .add('tares', '/:username/tares')