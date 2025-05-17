const pool = require('../db');

// Créer un menu et retourner son ID
const createTypeProducts = (type_name) => {
  return pool.query('INSERT INTO type_products (type_name) VALUES ($1) RETURNING *', [type_name]);
};

// Récupérer tous les menus
const getAllTypeProducts = () => {
  return pool.query('SELECT * FROM type_products');
};

// Récupérer un menu par ID
const getTypeProductsById = (id) => {
  return pool.query('SELECT * FROM type_products WHERE id = $1', [id]);
};

const deleteTypeProducts = (id) => {
    return pool.query('DELETE FROM type_products WHERE id = $1 RETURNING *', [id]);
  };

module.exports = {
  createTypeProducts,
  getAllTypeProducts,
  getTypeProductsById,
  deleteTypeProducts,

};