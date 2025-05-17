const db = require('../db');

// Créer un nouvel utilisateur
const createUser = async (name, last_name, mail, password, role) => {
  const result = await db.query(
    `INSERT INTO users (name, last_name, mail, password, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING name, last_name, mail, role`,
    [name, last_name, mail, password, role]
  );
  return result;
};

// Obtenir un utilisateur par son mail
const getUserByMail = async (mail) => {
  const result = await db.query(
    `SELECT * FROM users WHERE mail = $1`,
    [mail]
  );
  return result; 
};

// Obtenir tous les utilisateurs
const getAllUsers = async () => {
  const result = await db.query(
    `SELECT * FROM users`
  );
  return result;
};

// Modifier le rôle d’un utilisateur
const updateRoleUser = async (id, role) => {
  const result = await db.query(
    `UPDATE users
     SET role = $2
     WHERE mail = $1
     RETURNING id, mail, role`,
    [id, role]
  );
  return result.rows[0]; // retourne l'utilisateur modifié
};


module.exports = {
  createUser,
  getUserByMail,
  getAllUsers,
  updateRoleUser,
};