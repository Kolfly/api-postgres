// authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware pour vérifier l'authentification (le token)
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token (en supposant qu'il est dans le format "Bearer token")

  if (!token) {
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  }

  // Vérification du token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }

    // Ajouter les informations de l'utilisateur à la requête
    req.user = user;
    next(); // Passe à la suite (le rôle pourra être vérifié dans le middleware suivant)
  });
};

module.exports = { authenticateToken };
