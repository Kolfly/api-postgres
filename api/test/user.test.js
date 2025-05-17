// tests/user.test.js
const request = require('supertest');
const app = require('../index'); // Adapte ce chemin à ton fichier d'entrée Express
const pool = require('../db');   // Pour la configuration et le nettoyage de la BDD
require('dotenv').config();

describe('User API', () => {
  const testUser = {
    name: 'Test',
    last_name: 'User',
    mail: 'testuser@example.com',
    password: 'Password123!',
    role: 1,
  };

  afterAll(async () => {
    // Supprime l'utilisateur test de la base après tous les tests
    await pool.query('DELETE FROM users WHERE mail = $1', [testUser.mail]);
    await pool.end();
  });

  test('Register new user', async () => {
    const res = await request(app)
      .post('/users')
      .send(testUser);

    console.log(res.body); // 🔍 pour diagnostiquer la réponse

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.mail).toBe(testUser.mail);
  });

  test('Login with correct credentials', async () => {
    const res = await request(app)
      .post('/users/login') // Adapte ce chemin si besoin
      .send({ mail: testUser.mail, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    // La réponse contient "role" au niveau racine et non pas dans un objet "user"
    expect(res.body).toHaveProperty('role', testUser.role);
  });

  test('Get all users (protected route)', async () => {
    // Connexion pour récupérer un token
    const login = await request(app)
      .post('/users/login')
      .send({ mail: testUser.mail, password: testUser.password });

    const res = await request(app)
      .get('/users') // Adapte à ta route
      .set('Authorization', `Bearer ${login.body.token}`);
      
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Update user role', async () => {
    const res = await request(app)
      .put('/users/updateRole') // Adapte à ta route
      .send({ mail: testUser.mail, role: 4 });

    expect(res.statusCode).toBe(200);
    // On suppose ici que la réponse renvoie un objet "user" mis à jour
    expect(res.body.user.role).toBe(4);
  });

  test('Get user by mail', async () => {
    const res = await request(app)
      .get(`/users/mail`)// Adapte à ta route
      .send({ mail: testUser.mail }) // Envoie le mail dans le corps de la requête
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mail', testUser.mail);
  });
});
