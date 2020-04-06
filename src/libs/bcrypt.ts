import bcrypt from 'bcryptjs';

export const encrypthPassword = async function (password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const matchPassword = async function (
  password: string,
  savedPassword: string
): Promise<Boolean> {
  return await bcrypt.compare(password, savedPassword);
};
