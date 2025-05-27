const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require('path');

const SWAGGER_DOCUMENT_PATH = path.join(__dirname, 'swagger.yaml');
// Affiche le chemin absolu pour vérifier l'emplacement
console.log('Chemin absolu vers swagger.yaml :', SWAGGER_DOCUMENT_PATH);

const swaggerDocument = yaml.load(SWAGGER_DOCUMENT_PATH);

module.exports = (app) => {
  // Configure la route pour accéder à la doc Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
