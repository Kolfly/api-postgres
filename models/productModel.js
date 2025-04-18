// models/productModel.js
const pool = require('../db');

// Récupérer tous les produits
const getAllProducts = () => {
  return pool.query('SELECT * FROM products ORDER BY id ASC');
};

// Récupérer un produit par ID
const getProductById = (id) => {
  return pool.query('SELECT * FROM products WHERE id = $1', [id]);
};

// Créer un produit avec un menu associé
const createProduct = (name, description, price, stock, menus) => {
  return pool.query(
    'INSERT INTO products (name, description, price, stock, menus) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, description, price, stock, menus]
  );
};

// Mettre à jour un produit
const updateProduct = (id, name, description, price, stock, menus) => {
  return pool.query(
    'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, menus = $5 WHERE id = $6 RETURNING *',
    [name, description, price, stock, menus, id]
  );
};

// Supprimer un produit
const deleteProduct = (id) => {
  return pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
