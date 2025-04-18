// controllers/menusController.js
const menusModel = require('../models/menusModel');

// GET tous les menus
const getAllMenus = async (req, res) => {
  try {
    const result = await menusModel.getAllMenus();
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des menus:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET un menu par ID
const getMenuById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await menusModel.getMenuById(id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la récupération du menu:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST création d’un menu
const createMenu = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Le nom du menu est requis' });
  }

  try {
    const result = await menusModel.createMenu(name);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la création du menu:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// DELETE suppression d’un menu
const deleteMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await menusModel.deleteMenu(id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu non trouvé' });
    }
    res.json({ message: 'Menu supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du menu:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getAllMenus,
  getMenuById,
  createMenu,
  deleteMenu,
};
