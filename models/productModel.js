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

// Créer un nouveau produit (sans insérer manuellement l'id)
const createProduct = async ({ name, description, price, dispo, type, image }) => {
  const result = await pool.query(
    `INSERT INTO products (name, description, price, dispo, type, image)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, description, price, dispo, type, image]
  );
  return result.rows[0];
};

// Mettre à jour un produit
const updateProduct = (id, name, description, price, dispo, type) => {
  return pool.query(
    'UPDATE products SET name = $1, description = $2, price = $3, dispo = $4, type = $5 WHERE id = $6 RETURNING *',
    [name, description, price, dispo, type, id]
  );
};

// Supprimer un produit
const deleteProduct = (id) => {
  return pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
};

//récupérer les produits par type
const getProductsByType = (type) => {
  return pool.query('SELECT * FROM products WHERE type = $1', [type]);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByType,
};
