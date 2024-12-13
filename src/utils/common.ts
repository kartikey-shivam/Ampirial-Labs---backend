export const GetRandomData = <T>(data: T[] | Record<string, T>): T => {
  if (Array.isArray(data)) {
    const randomIndex = Math.floor(Math.random() * data.length)
    // If it's an array, pick a random element
    return data[randomIndex]
  } else {
    // If it's an object, pick a random value
    const values = Object.values(data)
    const randomIndex = Math.floor(Math.random() * values.length)
    return values[randomIndex]
  }
}

export const generateRandomPassword = (
  length: number = 8,
  options: {
    includeUppercase?: boolean
    includeLowercase?: boolean
    includeNumbers?: boolean
    includeSymbols?: boolean
  } = {}
): string => {
  const { includeUppercase = true, includeLowercase = true, includeNumbers = true, includeSymbols = true } = options

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?'
  let characterPool = ''

  if (includeUppercase) characterPool += uppercaseChars
  if (includeLowercase) characterPool += lowercaseChars
  if (includeNumbers) characterPool += numberChars
  if (includeSymbols) characterPool += symbolChars

  if (!characterPool) {
    throw new Error('At least one character type must be included.')
  }

  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characterPool.length)
    password += characterPool[randomIndex]
  }

  return password
}
