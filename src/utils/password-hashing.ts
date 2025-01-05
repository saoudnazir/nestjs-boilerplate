import * as bcrypt from 'bcrypt';

export function generateHashedPasswordSync(password: string) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}
