
const productModel = require('../models/productModel');
const menuModel = require('../models/menusModel.js');
const pool = require('../db');  

// GET tous les produits
const getAllProducts = async (req, res) => {
  try {
    const result = await productModel.getAllProducts();
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET un produit par ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await productModel.getProductById(id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la récupération du produit:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST création d’un produit
const createProduct = async (req, res) => {
  const { name, description, price, stock, menus } = req.body;

  // Vérifier que l'ID du menu est fourni
  if (!menus) {
    return res.status(400).json({ error: 'L\'ID du menu est requis pour créer un produit' });
  }

  // Vérifier si l'ID du menu existe dans la table 'menus'
  const menuCheck = await pool.query('SELECT id FROM menus WHERE id = $1', [menus]);
  if (menuCheck.rows.length === 0) {
    return res.status(400).json({ error: 'Menu non trouvé pour cet ID' });
  }

  try {
    // Créer le produit avec l'ID du menu spécifié
    const result = await productModel.createProduct(name, description, price, stock, menus);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la création du produit:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// PUT mise à jour d’un produit
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, menus } = req.body;

  // Vérifier si l'ID du menu existe dans la base de données si un menu est spécifié
  let menuId = menus;
  if (menuId) {
    const menuCheck = await pool.query('SELECT id FROM menus WHERE id = $1', [menuId]);
    if (menuCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Menu non trouvé pour cet ID' });
    }
  }

  try {
    // Mettre à jour le produit avec les nouveaux détails
    const result = await productModel.updateProduct(id, name, description, price, stock, menuId);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du produit:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// DELETE suppression d’un produit
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await productModel.deleteProduct(id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du produit:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
