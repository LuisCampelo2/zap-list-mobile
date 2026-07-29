import { User } from '../models/user.model.js';

const normalizeEmail = (email) => email.trim().toLowerCase();

/** Nunca retornar o model do Sequelize direto para o cliente: remove hash de senha e tokens internos. */
const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  lastName: user.lastName,
  email: user.email,
  // Sem coluna is_active própria: mesma convenção do banco original —
  // activationToken nulo significa conta ativa.
  isActive: user.activationToken === null,
});

export const userService = {
  normalizeEmail,
  toPublicUser,
  findByEmail: (email) => User.findOne({ where: { email: normalizeEmail(email) } }),
  findById: (id) => User.findByPk(id),
};
