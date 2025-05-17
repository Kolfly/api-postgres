const request = require('supertest');
const app = require('../index');

describe('Tests sur les routes /products', () => {

  it('doit récupérer tous les types', async () => {
    const response = await request(app).get('/typeProducts');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it('doit créer un nouveau type', async () => {
    const newType = {
      type_name: 'Type Test',  // Correspond à ce que le contrôleur attend
    };
  
    const response = await request(app)
      .post('/typeProducts')
      .set('Content-Type', 'application/json')
      .send(newType);  // Envoyer l'objet avec la propriété type_name
  
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('type_name', newType.type_name); // Vérifie que la réponse contient bien le nom du type
  });


  it('doit récupérer les produits par ID', async () => {
    const response = await request(app).get('/typeProducts/3');
    expect([200, 404]).toContain(response.statusCode);
    if (response.statusCode === 200) {
      expect(response.body).toBeInstanceOf(Object);
    }
  });

  


  it('doit supprimer un type', async () => {
    const response = await request(app).delete('/types/11');
  
    // Vérifie seulement le statusCode
    expect([200, 404]).toContain(response.statusCode);
  });

});
