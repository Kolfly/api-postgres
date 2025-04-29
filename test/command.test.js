const request = require('supertest');
const app = require('../index'); // Assure-toi que l'application Express est exportée correctement depuis index.js
const db = require('../db');  // Assure-toi que ta base de données est correctement configurée pour les tests

describe('Tests sur les routes /commands', () => {

  it('doit récupérer toutes les commandes', async () => {
    const response = await request(app).get('/commands');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array); // Vérifie que la réponse est un tableau
  });

  it('doit récupérer une commande par ID', async () => {
    const response = await request(app).get('/commands/29'); // Remplace 1 par un ID valide dans ta DB
    if (response.statusCode === 200) {
      expect(response.body).toHaveProperty('id_command', 29); // Vérifie que l'ID de la commande correspond
    } else {
      expect(response.statusCode).toBe(404);
    }
  });

  it('doit créer une nouvelle commande', async () => {
    const newCommand = {
      nom_client: 'Client Test',
      statut: 'En attente',
      details: [
        { code_produit: 9, quantite: 2 },
        { code_produit: 21, quantite: 1 }
      ]
    };

    // Envoie la requête POST pour créer une commande
    const response = await request(app)
      .post('/commands')
      .set('Content-Type', 'application/json')
      .send(newCommand);

    // Vérifie que la commande a été créée avec succès
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Commande créée avec succès');
    expect(response.body).toHaveProperty('id_command');  // Note que j'ai corrigé ici "id_commnand" -> "id_command"

    // Vérifie si la commande a bien été ajoutée dans la base de données
    const { rows } = await db.query('SELECT * FROM Command_tete WHERE id_command = $1', [response.body.id_command]);
    expect(rows.length).toBe(1);  // Une commande devrait avoir été insérée
    expect(rows[0].nom_client).toBe('Client Test');
    expect(rows[0].statut).toBe('En attente');

    // Vérifie si les détails de la commande ont bien été insérés
    const detailsRes = await db.query(
      'SELECT * FROM Command_detail WHERE id_command = $1',
      [response.body.id_command]
    );
    expect(detailsRes.rows.length).toBe(2);  // Deux produits dans la commande
    expect(detailsRes.rows[0].code_produit).toBe(9);
    expect(detailsRes.rows[1].code_produit).toBe(21);
  });

  it('doit mettre à jour le statut d’une commande', async () => {
    const updateCommand = {
      id: 29, // Remplace 29 par un ID valide dans ta DB
      statut: 'en cours'
    };

    const response = await request(app)
      .put('/update')
      .send(updateCommand);

    if (response.statusCode === 200) {
      expect(response.body).toHaveProperty('message', 'Statut mis à jour avec succès');
    } else {
      expect(response.statusCode).toBe(404);
    }
  });

});
