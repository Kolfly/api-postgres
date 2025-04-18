

// Middleware pour vérifier si l'utilisateur a le bon rôle
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
      // Si l'utilisateur n'est pas authentifié ou n'a pas un rôle autorisé
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Accès refusé : rôle insuffisant' });
      }
      next(); // L'utilisateur a un rôle autorisé, on passe à la suite
    };
  };
  
  module.exports = authorizeRole;
  