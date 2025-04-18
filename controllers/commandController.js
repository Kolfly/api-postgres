const commandModel = require('../models/commandModel');
const db = require('../db');

// Récupérer toutes les commandes avec leurs détails
const getAllCommands = async (req, res) => {
  try {
    const commands = await commandModel.getAllCommands();
    res.json(commands);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

// Récupérer une commande par ID avec ses détails
const getCommandById = async (req, res) => {
  const { id } = req.params;  // Récupérer l'ID de la commande depuis les paramètres de la requête
  try {
    const command = await commandModel.getCommandById(id);  // Appeler la méthode dans commandModel pour récupérer la commande
    if (command.length > 0) {
      res.json(command);  // Si la commande existe, la retourner en réponse
    } else {
      res.status(404).send('Commande non trouvée');  // Si la commande n'existe pas, renvoyer une erreur 404
    }
  } catch (error) {
    console.error(error);  // Log de l'erreur
    res.status(500).send('Erreur serveur');  // Retourner une erreur 500 en cas de problème
  }
};

// Ajouter une nouvelle commande et ses détails
const addCommand = async (req, res) => {
  const { nom_client, statut, details } = req.body;

  try {
    // Log: Afficher les détails de la commande reçus
    console.log("Détails de la commande reçus:", details);

    // Récupérer les prix depuis la table products
    const productIds = details.map(d => d.code_produit); // Assurez-vous que le nom des produits est correct
    console.log("Product IDs:", productIds);

    const { rows: products } = await db.query(
      `SELECT id, price FROM products WHERE id = ANY($1::int[])`,
      [productIds]
    );

    // Log: Afficher les produits récupérés
    console.log("Produits récupérés de la base de données:", products);

    // Vérifier que tous les produits existent
    const productMap = {};
    products.forEach(p => productMap[p.id] = p.price);

    for (const detail of details) {
      if (!productMap[detail.code_produit]) {
        console.log(`Produit avec ID ${detail.code_produit} introuvable.`);
        return res.status(400).json({ error: `Produit avec ID ${detail.code_produit} introuvable.` });
      }
    }

    // Calcul des sous-totaux
    const commandDetails = details.map(d => {
      return {
        code_produit: d.code_produit,
        quantite: d.quantite,
        prix_unitaire: productMap[d.code_produit],
        sous_total: d.quantite * productMap[d.code_produit]
      };
    });

    const totalPrice = commandDetails.reduce((sum, d) => sum + d.sous_total, 0);
    console.log("Prix total calculé:", totalPrice);

    // Insérer la commande principale
    const { rows } = await db.query(
      `INSERT INTO Command_tete (nom_client, price, statut)
       VALUES ($1, $2, $3) RETURNING id_command`,
      [nom_client, totalPrice, statut]
    );

    const id_command = rows[0].id_command;
    console.log("Commande créée avec ID:", id_command);

    // Insérer les détails de la commande
    const insertPromises = commandDetails.map(d => {
      return db.query(
        `INSERT INTO Command_detail (id_command, code_produit, quantite, prix_unitaire)
         VALUES ($1, $2, $3, $4)`,
        [id_command, d.code_produit, d.quantite, d.prix_unitaire]
      );
    });

    await Promise.all(insertPromises);

    // Répondre avec succès
    res.status(201).json({ message: 'Commande créée avec succès', id_command });

  } catch (error) {
    // Enregistrer l'erreur dans les logs et répondre
    console.error("Erreur dans l'ajout de la commande:", error);
    res.status(500).send("Erreur lors de la création de la commande");
  }
};


// Modifier le statut d'une commande
const updateCommandStatus = async (req, res) => {
  const { id } = req.body;
  const { statut } = req.body;

  try {
    const result = await db.query(
      `UPDATE command_tete SET statut = $1 WHERE id_command = $2`,
      [statut, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    res.status(200).json({ message: "Statut mis à jour avec succès", commande: result.rows[0] });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    res.status(500).send("Erreur lors de la mise à jour du statut");
  }
};



module.exports = {
  getAllCommands,
  getCommandById,
  addCommand,
  updateCommandStatus,
};
