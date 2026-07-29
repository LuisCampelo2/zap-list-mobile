import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const passwordService = {
  hash: (plain) => bcrypt.hash(plain, SALT_ROUNDS),
  compare: (plain, hash) => bcrypt.compare(plain, hash),
};
