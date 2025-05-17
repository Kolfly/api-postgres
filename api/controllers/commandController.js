const commandModel = require('../models/commandModel');
const pool = require('../db');

// Fonction pour éviter les erreurs de sérialisation JSON 
const safeLog = (obj) => {
  try {
    console.log(JSON.stringify(obj, (key, value) =>
      key === 'socket' ? undefined : value)); // Ignore le 'socket' ou autres propriétés circulaires
  } catch (e) {
    console.error("Erreur de sérialisation JSON dans safeLog", e);
  }
};

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
      // Utiliser safeLog si vous avez besoin de sérialiser des objets complexes
      safeLog(command);
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
//creer une commande


const addCommand = async (req, res) => {
  console.log("Début de l'ajout de la commande");
  const { selection, chevalet, total, articles, client } = req.body;
  console.log("Corps reçu dans la requête:", req.body);

  // Validation
  if (
    !selection ||
    !chevalet ||
    !client ||
    !Array.isArray(articles) ||
    articles.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Données invalides. Veuillez vérifier les champs requis." });
  }

  try {
    // Insertion dans Command_tete
    const insertTeteQuery = `
      INSERT INTO Command_tete (nom_client, price, statut, chevalet, selection)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_command;
    `;

    const { rows } = await pool.query(insertTeteQuery, [
      client,
      total,
      "en cours",
      chevalet,
      selection,
    ]);

    const id_command = rows[0].id_command;
    console.log(`Commande principale insérée avec succès. id_command=${id_command}`);

    // Insertion dans Command_detail
    const insertDetailQuery = `
      INSERT INTO Command_detail (id_command, code_produit)
      VALUES ($1, $2);
    `;

    for (const article of articles) {
      const code_produit = article.id;
      console.log(`Ajout du produit: code_produit=${code_produit}`);
      await pool.query(insertDetailQuery, [id_command, code_produit]);
    }

    res.status(201).json({ message: "Commande créée avec succès", id_command });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la commande:", error.stack);
    res.status(500).json({ error: "Erreur lors de l'ajout de la commande" });
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
    const queryText = `UPDATE command_tete SET statut = $1 WHERE id_command = $2 RETURNING *`;
    console.log("Exécution de la requête SQL :", queryText);
    console.log("Valeurs utilisées :", [statut, id]);

    const result = await pool.query(queryText, [statut, id]);
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
