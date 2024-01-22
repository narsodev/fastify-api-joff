import bcrypt from 'bcrypt'

export const hash = async (input: string, rounds: number): Promise<string> => {
  const salt = await bcrypt.genSalt(rounds)

  return bcrypt.hash(input, salt)
}

export const compareWithHash = async (
  input: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(input, hashed)
}
