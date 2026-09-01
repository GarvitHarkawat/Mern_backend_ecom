const bcrypt = require("bcryptjs");

const hashPassword = async (plain) => {
  const rounds = Number(process.env.SALT_ROUNDS);
  const hash = await bcrypt.hash(plain, rounds);
  return hash;
};

const verifyPassword = async (plain, hash) => {
  return await bcrypt.compare(plain, hash);
};

module.exports = { hashPassword, verifyPassword };