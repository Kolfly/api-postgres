/*²
const request = require('supertest');
const jwt = require('jsonwebtoken');
const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

const app = express();
app.use(express.json());


// Route protégée par authenticateToken seulement
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Accès autorisé', user: req.user });
});


// Route protégée par authenticateToken + authorizeRole
app.get('/users', authenticateToken, authorizeRole(1), (req, res) => {
  res.json({ message: 'Accès admin autorisé' });
});

const SECRET = process.env.JWT_SECRET || 'unSuperSecretTrèsSecurisé123'; // même secret que dans ton code

describe('Middleware Authentification et Autorisation', () => {
  let userToken;
  let adminToken;

  beforeAll(() => {
    // Token pour user normal (role 1)
    userToken = jwt.sign({ mail: 'user@example.com', role: 1 }, SECRET, { expiresIn: '1h' });

    // Token pour admin (role 0)
    adminToken = jwt.sign({ mail: 'admin@example.com', role: 0 }, SECRET, { expiresIn: '1h' });
  });

  test('Accès route protégée avec token valide', async () => {
    const res = await request(app)
      .get('/products/type/1')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Accès autorisé');
    expect(res.body.user).toHaveProperty('mail', 'user@example.com');
  });

  test('Accès route protégée sans token', async () => {
    const res = await request(app).get('/protected');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Token manquant ou invalide');
  });

  test('Accès admin-only avec token admin', async () => {
    const res = await request(app)
      .get('/admin-only')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Accès admin autorisé');
  });

  test('Accès admin-only avec token user (devrait échouer)', async () => {
    const res = await request(app)
      .get('/admin-only')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('error', 'Accès refusé : rôle insuffisant');
  });

  test('Accès route avec token invalide', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer faketoken');

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('error', 'Token invalide ou expiré');
  });
});*/
