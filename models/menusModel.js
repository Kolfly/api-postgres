const pool = require('../db');

// Créer un menu et retourner son ID
const createMenu = (name) => {
  return pool.query('INSERT INTO menus (name) VALUES ($1) RETURNING *', [name]);
};

// Récupérer tous les menus
const getAllMenus = () => {
  return pool.query('SELECT * FROM menus');
};

// Récupérer un menu par ID
const getMenuById = (id) => {
  return pool.query('SELECT * FROM menus WHERE id = $1', [id]);
};

const deleteMenu = (id) => {
    return pool.query('DELETE FROM menus WHERE id = $1 RETURNING *', [id]);
  };

module.exports = {
  createMenu,
  getAllMenus,
  getMenuById,
};