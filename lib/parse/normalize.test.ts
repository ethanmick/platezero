import { normalize } from './normalize'

test.each([
  ['simple', 'simple'],
  ['½ cup milk', '1/2 cup milk'],
  ['&frac14; teaspoon salt', '1/4 teaspoon salt'],
])('normalize(%s)', (s: string, expected: string) => {
  expect(normalize(s)).toEqual(expected)
})
