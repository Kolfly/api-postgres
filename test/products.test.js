const request = require('supertest');
const app = require('../index');

describe('Tests sur les routes /products', () => {

  it('doit récupérer tous les produits', async () => {
    const response = await request(app).get('/products');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it('doit créer un nouveau produit', async () => {
    const newProducts = [ // <-- ici, un tableau !!
      {
        name: 'Produit Test',
        description: 'Ceci est un produit de test',
        price: 10.99,
        dispo: true,
        type: 1,
        image: 'http://example.com/image.jpg'
      }
    ];
  
    const response = await request(app)
      .post('/products')
      .set('Content-Type', 'application/json')
      .send(newProducts); // <-- envoyer un tableau ici aussi
  
    expect(response.statusCode).toBe(201);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].name).toBe(newProducts[0].name);
  });
  


  it('doit récupérer les produits par ID', async () => {
    const response = await request(app).get('/products/20');
    expect([200, 404]).toContain(response.statusCode);
    if (response.statusCode === 200) {
      expect(response.body).toBeInstanceOf(Array);
    }
  });


  it('doit récupérer les produits par type', async () => {
    const response = await request(app).get('/products/type/1');
    expect([200, 404]).toContain(response.statusCode);
    if (response.statusCode === 200) {
      expect(response.body).toBeInstanceOf(Array);
    }
  });

  it('doit mettre à jour un produit', async () => {
    const updatedProduct = {
      id: 4,
      name: 'Produit Test Modifié',
        description: 'Ceci est un produit de test modifié',
      price: 12.99,
      dispo: false,
      type: 2
    };
    const response = await request(app)
      .put('/products')
      .send(updatedProduct);

    expect([200, 404]).toContain(response.statusCode);
  });

  it('doit supprimer un produit', async () => {
    const response = await request(app).delete('/products/4');
    if (response.statusCode === 200) {
      expect(response.body).toHaveProperty('message', 'Produit supprimé avec succès');
    } else if (response.statusCode === 404) {
      expect(response.body).toHaveProperty('error', 'Produit non trouvé');
    }
  });

});
