const fractions: { [key: string]: string } = {
  '½': '1/2',
  '⅓': '1/3',
  '⅔': '2/3',
  '¼': '1/4',
  '¾': '3/4',
  '⅖': '2/5',
  '⅗': '3/5',
  '⅘': '4/5',
  '⅙': '1/6',
  '⅚': '5/6',
  '⅐': '1/7',
  '⅛': '1/8',
  '⅜': '3/8',
  '⅝': '5/8',
  '⅞': '7/8',
  '⅑': '1/9',
  '⅒': '1/10',
  '&frac12;': '1/2',
  '&frac13;': '1/3',
  '&frac23;': '2/3',
  '&frac14;': '1/4',
  '&frac34;': '3/4',
  '&frac25;': '2/5',
  '&frac35;': '3/5',
  '&frac45;': '4/5',
  '&frac16;': '1/6',
  '&frac56;': '5/6',
  '&frac17;': '1/7',
  '&frac18;': '1/8',
  '&frac38;': '3/8',
  '&frac58;': '5/8',
  '&frac78;': '7/8',
  '&frac19;': '1/9',
  '&frac110;': '1/10',
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
