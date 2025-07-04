const productModel = require('../models/productModel');
const pool = require('../db');

// GET tous les produits
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET un produit par ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (err) {
    console.error('Erreur lors de la récupération du produit:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const createProduct = async (req, res) => {
  const products = req.body; // Supposons que req.body soit un tableau d'objets produits

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Le tableau de produits est requis et ne peut pas être vide." });
  }

  try {
    const newProducts = [];

    for (const product of products) {
      const { name, description, price, dispo, type, image } = product;

      if (!type) {
        return res.status(400).json({ error: "L'ID du type est requis pour chaque produit." });
      }

      // Vérifier que le type existe dans products_type
      const typeCheck = await pool.query("SELECT id FROM type_products WHERE id = $1", [type]);
      if (typeCheck.rows.length === 0) {
        return res.status(400).json({ error: `Type de produit non trouvé pour cet ID: ${type}` });
      }

      // Création du produit
      const newProduct = await productModel.createProduct({ name, description, price, dispo, type, image });
      newProducts.push(newProduct);
    }

    res.status(201).json(newProducts);
  } catch (err) {
    console.error("Erreur lors de la création des produits:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


// PUT mise à jour d’un produit
const updateProduct = async (req, res) => {
  const { id, name, description, price, dispo, type, image } = req.body;

  // Vérifier que le type existe, s’il est fourni
  if (type) {
    const typeCheck = await pool.query('SELECT id FROM type_products WHERE id = $1', [type]);
    if (typeCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Type de produit non trouvé pour cet ID' });
    }
  }

  try {
    console.log("Mise à jour du produit avec ID:", id);

    const updated = await productModel.updateProduct(id, name, description, price, dispo, type, image);

    console.log("Résultat de la mise à jour :", updated);

    if (!updated || Object.keys(updated).length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du produit:' + id );
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


//  suppression d’un produit
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await productModel.deleteProduct(id);

    if (deleted.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du produit:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const getProductsByType = async (req, res) => {
  const { type } = req.params;
  try {
    const result = await productModel.getProductsByType(type);

    // Vérif des produits ont été trouvés
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aucun produit trouvé pour ce type' });
    }

    // Si des produits sont trouvés
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des produits par type:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const getProductsByIds = async (req, res) => {
  const idsParam = req.query.ids;

  if (!idsParam) {
    return res.status(400).json({ error: "Le paramètre 'ids' est requis. Exemple : /products/ids?ids=1,2,3" });
  }

  const ids = idsParam.split(',').map(Number).filter(id => !isNaN(id));

  if (ids.length === 0) {
    return res.status(400).json({ error: "Le paramètre 'ids' doit contenir au moins un ID valide." });
  }

  try {
    const products = await productModel.getProductsByIds(ids);

    if (products.length === 0) {
      return res.status(404).json({ error: "Aucun produit trouvé pour les IDs spécifiés." });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error('Erreur lors de la récupération des produits par IDs:', err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByType,
  getProductsByIds
};
