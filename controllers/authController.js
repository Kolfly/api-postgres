const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');  
const { get } = require('mongoose');

// Enregistrement d’un nouvel utilisateur
const registerUser = async (req, res) => {
  const { name, last_name, mail, password, role } = req.body;

  // Vérifier que tous les champs requis sont présents
  if (!name || !last_name || !mail || !password || !role) {
    return res.status(400).json({ error: 'Tous les champs sont requis (name, last_name, mail, password, role)' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà (par exemple, par l'email)
    const existingUser = await userModel.getUserByMail(mail);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Adresse mail déjà utilisée' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    // Créer l'utilisateur
    const newUser = await userModel.createUser(name, last_name, mail, hashedPassword, role);
    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser.rows[0] });
  } catch (error) {
    console.error('Erreur lors de l’enregistrement :', error);
    res.status(500).json({ error: 'Erreur serveur lors de l’enregistrement' });
  }
};

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des utilisateurs' });
  }
};

// Contrôleur pour mettre à jour le rôle d’un utilisateur
const updateUserRole = async (req, res) => {
  
  const { mail, role } = req.body;

  if (!mail || !role) {
    return res.status(400).json({ error: 'L\'adresse mail et le rôle sont requis.' });
  }

  try {
    const updatedUser = await userModel.updateRoleUser(mail, role);

    if (!updatedUser) {
      return res.status(404).json({ error: `Utilisateur avec l'adresse mail "${mail}" introuvable.` });
    }

    res.json({ message: `Rôle de l'utilisateur avec l'adresse mail ${mail} mis à jour en "${role}" avec succès.`, user: updatedUser });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle :', error.message);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du rôle.' });
  }
};

// Connexion et génération de token
const loginUser = async (req, res) => {
  // Remplacer "username" par "mail"
  const { mail, password } = req.body;

  try {
    // Utiliser getUserByMail au lieu de getUserByUsername
    const result = await userModel.getUserByMail(mail);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    const payload = {
      userId: user.id,
      role: user.role,
    };

    // S'assurer que le secret est bien défini
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET non défini dans .env');
      return res.status(500).json({ error: 'Erreur de configuration du serveur' });
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Connexion réussie',
      token: `Bearer ${token}`,
      role: user.role,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
// Récupérer un utilisateur par son adresse mail 

const getUserByMail = async (req, res) => {
  const { mail } = req.body;
  try {
    const result = await userModel.getUserByMail(mail);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur par mail:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  loginUser,
  updateUserRole,
  getUserByMail,
};
