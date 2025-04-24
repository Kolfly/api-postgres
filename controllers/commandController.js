const commandModel = require('../models/commandModel');
const db = require('../db');

// Récupérer toutes les commandes avec leurs détails
const getAllCommands = async (req, res) => {
  console.log("getAllCommands appelée");
  try {
    const commands = await commandModel.getAllCommands();
    console.log(`Nombre de commandes récupérées: ${commands.length}`);
    res.json(commands);
  } catch (error) {
    console.error("Erreur dans getAllCommands:", error.stack);
    res.status(500).send('Erreur serveur');
  }
};

// Récupérer une commande par ID avec ses détails
const getCommandById = async (req, res) => {
  const { id } = req.params;
  console.log(`getCommandById appelée avec id=${id}`);
  try {
    const command = await commandModel.getCommandById(id);
    console.log("Commande récupérée:", command);
    if (command.length > 0) {
      res.json(command);
    } else {
      console.warn(`Commande avec id=${id} non trouvée`);
      res.status(404).send('Commande non trouvée');
    }
  } catch (error) {
    console.error("Erreur dans getCommandById:", error.stack);
    res.status(500).send('Erreur serveur');
  }
};

// Ajouter une nouvelle commande et ses détails
const addCommand = async (req, res) => {
  console.log("addCommand appelée avec:", req.body);
  const { nom_client, statut, details } = req.body;

  try {
    // Log : détails reçus
    console.log("Détails de la commande reçus:", details);

    // Récupérer les identifiants de produits
    const productIds = details.map(d => d.code_produit);
    console.log("Product IDs:", productIds);

    // Récupérer les prix des produits dans la base
    const { rows: products } = await db.query(
      `SELECT id, price FROM products WHERE id = ANY($1::int[])`,
      [productIds]
    );
    console.log("Produits récupérés de la base de données:", products);

    // Construire une map { id: price }
    const productMap = {};
    products.forEach(p => {
      productMap[p.id] = p.price;
      console.log(`Produit ID ${p.id} avec prix: ${p.price}`);
    });

    // Vérifier que chaque produit dans details existe dans productMap
    for (const detail of details) {
      if (productMap[detail.code_produit] === undefined) {
        console.error(`Produit avec ID ${detail.code_produit} introuvable.`);
        return res.status(400).json({ error: `Produit avec ID ${detail.code_produit} introuvable.` });
      }
    }

    // Calculer les sous-totaux et préparer les détails de commande
    const commandDetails = details.map(d => {
      return {
        code_produit: d.code_produit,
        quantite: d.quantite,
        prix_unitaire: productMap[d.code_produit],
        sous_total: d.quantite * productMap[d.code_produit]
      };
    });
    console.log("Détails de la commande calculés:", commandDetails);

    // Calculer le prix total de la commande
    const totalPrice = commandDetails.reduce((sum, d) => sum + d.sous_total, 0);
    console.log("Prix total calculé:", totalPrice);

    // Insérer la commande principale et récupérer son ID
    console.log(`Insertion de la commande principale avec nom_client="${nom_client}", prix=${totalPrice}, statut="${statut}"`);
    const { rows } = await db.query(
      `INSERT INTO Command_tete (nom_client, price, statut)
       VALUES ($1, $2, $3) RETURNING id_command`,
      [nom_client, totalPrice, statut]
    );
    const id_command = rows[0].id_command;
    console.log("Commande créée avec ID:", id_command);

    // Insérer les détails de la commande
    console.log("Insertion des détails de commande dans Command_detail");
    const insertPromises = commandDetails.map(d => {
      console.log(`Insertion du détail - code_produit: ${d.code_produit}, quantite: ${d.quantite}, prix_unitaire: ${d.prix_unitaire}, sous_total: ${d.sous_total}`);
      return db.query(
        `INSERT INTO Command_detail (id_command, code_produit, quantite, prix_unitaire)
         VALUES ($1, $2, $3, $4)`,
        [id_command, d.code_produit, d.quantite, d.prix_unitaire]
      );
    });
    await Promise.all(insertPromises);
    console.log("Tous les détails ont été insérés avec succès");

    res.status(201).json({ message: 'Commande créée avec succès', id_command });
  } catch (error) {
    console.error("Erreur dans l'ajout de la commande:", error.stack);
    res.status(500).send("Erreur lors de la création de la commande");
  }
};

// Modifier le statut d'une commande avec logs détaillés
const updateCommandStatus = async (req, res) => {
  console.log("===========================================");
  console.log("Début de updateCommandStatus");
  console.log("Données reçues dans la requête :", req.body);

  const { id, statut } = req.body;
  console.log(`Tentative de mise à jour pour id_command = ${id} avec nouveau statut = "${statut}"`);

  try {
    // Préparer la requête SQL et les valeurs
    const queryText = `UPDATE command_tete SET statut = $1 WHERE id_command = $2 RETURNING *`;
    console.log("Exécution de la requête SQL :", queryText);
    console.log("Valeurs utilisées :", [statut, id]);

    const result = await db.query(queryText, [statut, id]);
    console.log("Résultat de la requête :", result);

    if (result.rowCount === 0) {
      console.warn(`Aucune commande trouvée pour id: ${id}`);
      console.log("===========================================");
      return res.status(404).json({ message: "Commande introuvable" });
    }

    console.log("Mise à jour réussie pour la commande avec id :", id);
    console.log("Commande mise à jour :", result.rows[0]);
    console.log("Fin de updateCommandStatus");
    console.log("===========================================");

    res.status(200).json({ message: "Statut mis à jour avec succès", commande: result.rows[0] });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error.stack);
    console.log("===========================================");
    res.status(500).send("Erreur lors de la mise à jour du statut");
  }
};

module.exports = {
  getAllCommands,
  getCommandById,
  addCommand,
  updateCommandStatus,
};
