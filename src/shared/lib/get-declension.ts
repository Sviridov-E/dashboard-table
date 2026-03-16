/**
 * @param words ['продукт', 'продукта', 'продуктов']
 * */
export const getDeclension = (
  words: [string, string, string],
  count: number
) => {
  const lastDigit = Number(String(count).slice(-1))
  if (isNaN(lastDigit)) return words[2]

  if (lastDigit === 1) return words[0]
  if (lastDigit > 1 && lastDigit < 5) return [1]
  return words[2]
}
