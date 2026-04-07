import bcrypt from "bcryptjs";

export async function hashPassword(password, saltRounds = 12) {
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}


