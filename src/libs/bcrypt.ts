import bcrypt from 'bcryptjs';

export const matchPassword = async function(
  password: string,
  savedPassword: string
): Promise<Boolean> {
  return await bcrypt.compare(password, savedPassword);
};
