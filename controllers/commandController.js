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

// Ajouter une nouvelle commande et ses détails
const addCommand = async (req, res) => {
  console.log("Début de l'ajout de la commande");
  const { nom_client, statut, details } = req.body;

  // Validate input data
  if (!nom_client || !statut || !Array.isArray(details) || details.length === 0) {
    console.error("Données invalides reçues:", req.body);
    return res.status(400).json({ error: "Données invalides. Veuillez vérifier les champs requis." });
  }

  try {
    console.log("Insertion de la commande principale dans Command_tete...");
    const insertTeteQuery = `
      INSERT INTO Command_tete (nom_client, price, statut)
      VALUES ($1, $2, $3) RETURNING id_command;
    `;
    const { rows } = await pool.query(insertTeteQuery, [nom_client, 0, statut]); // Initialiser le prix à 0
    const id_command = rows[0].id_command;
    console.log(`Commande principale insérée avec succès. id_command=${id_command}`);

    let totalPrice = 0;
    const insertDetailQuery = `
      INSERT INTO Command_detail (id_command, code_produit, quantite, prix_unitaire, sous_total)
      VALUES ($1, $2, $3, $4, $5);
    `;

    for (const detail of details) {
      const { code_produit, quantite } = detail;
      console.log(`Traitement du produit: code_produit=${code_produit}, quantite=${quantite}`);

      try {
        console.log(`Récupération du prix unitaire pour le produit avec code_produit=${code_produit}...`);
        const productRes = await pool.query(`SELECT price FROM products WHERE id = $1`, [code_produit]);

        if (productRes.rowCount === 0) {
          console.error(`Produit avec l'ID ${code_produit} introuvable`);
          return res.status(400).json({ error: `Produit avec l'ID ${code_produit} introuvable` });
        }

        const prix_unitaire = productRes.rows[0].price;
        console.log(`Prix unitaire récupéré: ${prix_unitaire}`);
        const sous_total = quantite && prix_unitaire ? parseFloat((quantite * prix_unitaire).toFixed(2)) : 0; 
        console.log(`Sous-total calculé: ${sous_total}`);
        if (isNaN(sous_total)) {
          console.error(`Erreur: sous_total est NaN pour code_produit=${code_produit}`);
          return res.status(400).json({ error: `Erreur de calcul pour le produit avec code_produit=${code_produit}` });
        }
        console.log("Insertion dans Command_detail avec : ", {
          id_command,
          code_produit,
          quantite,
          prix_unitaire,
          sous_total
        });
        console.log("Insertion du détail de la commande dans Command_detail...");
        const insertDetailValues = [
          id_command,
          code_produit,
          quantite,
          prix_unitaire,
          sous_total
        ];
        console.log("Valeurs pour l'insertion dans Command_detail:", insertDetailValues);
        await pool.query(insertDetailQuery, insertDetailValues.map(value => (typeof value === 'number' ? value : parseFloat(value))));
        console.log("Détail inséré avec succès.");
        totalPrice += sous_total; // Mise à jour du prix total de la commande
        console.log(`Prix total mis à jour: ${totalPrice}`);
      } catch (err) {
        console.error(`Erreur lors du traitement du produit avec code_produit=${code_produit}:`, {
          message: err.message,
          stack: err.stack,
          detail: {
            id_command,
            code_produit,
            quantite,
            sous_total: totalPrice
          }
        });
        return res.status(500).json({ 
          error: `Erreur lors du traitement du produit avec code_produit=${code_produit}`, 
          details: {
            message: err.message,
            code_produit,
            quantite,
            id_command
          }
        });
            }
          }

    console.log("Mise à jour du prix total dans Command_tete...");
    await pool.query(
      `UPDATE Command_tete SET price = $1 WHERE id_command = $2`,
      [totalPrice, id_command]
    );
    console.log(`Prix total mis à jour avec succès pour la commande: ${totalPrice}`);

    res.status(201).json({ id_command, nom_client, statut, price: totalPrice });
    console.log("Commande ajoutée avec succès.");
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
