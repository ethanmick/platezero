import { normalize } from './normalize'

test.each([
  ['simple', 'simple'],
  ['½ cup milk', '½ cup milk'],
  ['&frac14; teaspoon salt', '¼ teaspoon salt'],
])('normalize(%s)', (s: string, expected: string) => {
  expect(normalize(s)).toEqual(expected)
})
