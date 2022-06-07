const fractions: { [key: string]: string } = {
  '&frac12;': '½',
  '&frac13;': '⅓',
  '&frac23;': '⅔',
  '&frac14;': '¼',
  '&frac34;': '¾',
  '&frac25;': '⅖',
  '&frac35;': '⅗',
  '&frac45;': '⅘',
  '&frac16;': '⅙',
  '&frac56;': '⅚',
  '&frac17;': '⅐',
  '&frac18;': '⅛',
  '&frac38;': '⅜',
  '&frac58;': '⅝',
  '&frac78;': '⅞',
  '&frac19;': '⅑',
  '&frac110;': '⅒',
}

/**
 * normalize goes through and cleans up the recipe input:
 *
 * 1. Trims strings
 * 2. Replace HTML fraction entities with fractions
 *
 * @param s The string to normalize
 */
export const normalize = (s: string): string => {
  s = s.trim()
  const fractionReplace = new RegExp(
    `(${Object.keys(fractions).join('|')})`,
    'gm'
  )
  s = s.replace(fractionReplace, (match: string) => fractions[match])
  return s
}
