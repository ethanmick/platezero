import * as _ from 'lodash'

export const getName = (user: any): string =>
  user.name ? user.name : user.username

export const normalize = (x: any): any => {
  if (_.isArray(x)) {
    return _.map(x, normalize)
  }
  if (_.isObject(x)) {
    return _.mapValues(x as object, normalize)
  }
  if (_.isNil(x)) {
    return undefined
  }
  if (_.isString(x) && _.trim(x) === '') {
    return undefined
  }
  return x
}
