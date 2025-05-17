
const typeProductsModel = require('../models/typeProductsModele');

// GET tous les types de produits
const getAllTypeProducts = async (req, res) => {
  try {
    const result = await typeProductsModel.getAllTypeProducts();
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des type:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET un type par ID
const getTypeProductsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await typeProductsModel.getTypeProductsById(id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Type non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la récupération du Type:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST création d’un type
const createTypeProducts = async (req, res) => {
  const { type_name } = req.body;
  if (!type_name) {
    return res.status(400).json({ error: 'Le nom du type est requis' });
  }

  try {
    const result = await typeProductsModel.createTypeProducts(type_name);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la création du type:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

//  suppression d’un type
const deleteTypeProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await typeProductsModel.deleteTypeProducts(id);

    if (result.rowCount === 0) {  // Vérif aucune ligne n'a été supprimée
      return res.status(404).json({ error: 'type non trouvé' });
    }

    // Si la suppression a réussi
    res.status(200).json({ message: 'type supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du type:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


module.exports = {
  getAllTypeProducts,
  getTypeProductsById,
  createTypeProducts,
  deleteTypeProducts,
};
