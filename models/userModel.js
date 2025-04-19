const db = require('../db');

// Créer un nouvel utilisateur
const createUser = async (username, password, role) => {
  const result = await db.query(
    `INSERT INTO users (username, password, role)
     VALUES ($1, $2, $3)
     RETURNING id, username, role`,
    [username, password, role]
  );
  return result;
};

// Obtenir un utilisateur par son nom d'utilisateur
const getUserByUsername = async (username) => {
  const result = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );
  return result; // ✅ version que tu veux garder
};

// Obtenir tous les utilisateurs
const getAllUsers = async () => {
  const result = await db.query(
    `SELECT id, username, role FROM users`
  );
  return result;
};

// Modifier le rôle d’un utilisateur
const updateRoleUser = async (id, role) => {
  const result = await db.query(
    `UPDATE users
     SET role = $2
     WHERE username = $1
     RETURNING id, username, role`,
    [id, role]
  );
  return result.rows[0]; // retourne l'utilisateur modifié
};


module.exports = {
  createUser,
  getUserByUsername,
  getAllUsers,
  updateRoleUser,
};