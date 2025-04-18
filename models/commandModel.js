const pool = require('../db');

// Récupérer toutes les commandes avec leurs détails
const getAllCommands = async () => {
  const query = `
    SELECT c.id_command, c.nom_client, c.price, c.statut,
           cd.code_produit, cd.quantite, cd.prix_unitaire, cd.sous_total
    FROM Command_tete c
    JOIN Command_detail cd ON c.id_command = cd.id_command;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Récupérer une commande avec ses détails par ID
const getCommandById = async (id) => {
  const query = `
    SELECT c.id_command, c.nom_client, c.price, c.statut,
           cd.code_produit, cd.quantite, cd.prix_unitaire, cd.sous_total
    FROM Command_tete c
    JOIN Command_detail cd ON c.id_command = cd.id_command
    WHERE c.id_command = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows;
};

// Ajouter une nouvelle commande et ses détails (avec prix récupéré depuis "products")
const addCommand = async (nom_client, statut, details) => {
  // Insérer la commande principale
  const insertTeteQuery = `
    INSERT INTO Command_tete (nom_client, price, statut)
    VALUES ($1, 0, $2) RETURNING id_command;
  `;
  const { rows } = await pool.query(insertTeteQuery, [nom_client, statut]);
  const id_command = rows[0].id_command;

  let totalPrice = 0;
  const insertDetailQuery = `
    INSERT INTO Command_detail (id_command, code_produit, quantite, prix_unitaire, sous_total)
    VALUES ($1, $2, $3, $4, $5);
  `;

  for (const detail of details) {
    const { code_produit, quantite } = detail;

    // Récupérer le prix unitaire depuis la table products (id = code_produit)
    const productRes = await pool.query(`SELECT price FROM products WHERE id = $1`, [code_produit]);

    if (productRes.rowCount === 0) {
      throw new Error(`Produit avec l'ID ${code_produit} introuvable`);
    }

    const prix_unitaire = productRes.rows[0].price;
    const sous_total = quantite * prix_unitaire;

    await pool.query(insertDetailQuery, [
      id_command,
      code_produit,
      quantite,
      prix_unitaire,
      sous_total
    ]);

    totalPrice += sous_total;
  }

  // Mise à jour du prix total dans Command_tete
  await pool.query(
    `UPDATE Command_tete SET price = $1 WHERE id_command = $2`,
    [totalPrice, id_command]
  );

  return { id_command, nom_client, statut, price: totalPrice };
};

// Mettre à jour le statut d'une commande
const updateCommandStatus = async (id_command, newStatus) => {
  const query = `
    UPDATE Command_tete
    SET statut = $1
    WHERE id_command = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [newStatus, id_command]);
  return result.rows[0];
};

module.exports = {
  getAllCommands,
  getCommandById,
  addCommand,
  updateCommandStatus,
};
