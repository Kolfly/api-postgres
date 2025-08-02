
# 📦 API Node.js + PostgreSQL – Wacdo_v2

Une API RESTful développée en Node.js avec Express, connectée à une base de données PostgreSQL.  
Architecture propre et modulaire, avec support Swagger, gestion des tokens JWT, et tests unitaires avec Jest et Supertest.

---

## 🚀 Fonctionnalités

✅ Authentification sécurisée via JWT  
✅ Hashage des mots de passe (bcrypt / bcryptjs)  
✅ Gestion CORS  
✅ Documentation Swagger UI  
✅ Middleware d’autorisation  
✅ Architecture MVC (`controllers`, `models`, `routes`)  
✅ Base de données PostgreSQL    
✅ Variables d’environnement via dotenv  
✅ Organisation claire et extensible

---

## 🗂️ Arborescence du projet

```
.
├── config/
├── controllers/
├── iisnode/
├── middleware/
├── models/
├── routes/
├── test/
├── .env
├── db.js
├── index.js
├── swagger.yaml
└── swaggerConfig.js
```

---

## ⚙️ Prérequis

- Node.js ≥ 18
- PostgreSQL ≥ 14
- Un gestionnaire de paquets (npm ou yarn)

---

## 🛠️ Installation

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/Kolfly/api-postgre.git
cd ton-repo
```

### 2️⃣ Installer les dépendances

```bash
npm install
```

---

## 🧩 Variables d'environnement

Crée un fichier **.env** à la racine, et ajoute :  

```env
# Token
JWT_SECRET=
TEST_TOKEN=

# Base de données
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
```



---



## 📘 Documentation de l'API

La documentation est disponible grâce à **Swagger** :

```
http://localhost:3000/api-docs
```

Le fichier `swagger.yaml` est présent à la racine.

---

## 🐘 Base de données

Le projet utilise une base **PostgreSQL**.  
Une sauvegarde de la BDD est disponible dans le dépôt (par ex. `/wacdo_v2.sql`).

---

## ✅ Dépendances

\`\`\`json
"dependencies": {
  "bcrypt": "^6.0.0",
  "bcryptjs": "^3.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.5.0",
  "express": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.14.3",
  "pg": "^8.14.1",
  "swagger-ui-express": "^5.0.1",
  "yamljs": "^0.3.0"
},
"devDependencies": {
  "jest": "^29.7.0",
  "nodemon": "^3.1.9",
  "supertest": "^7.1.0"
}
\`\`\`

---

## 🧠 Auteur

Développé par **[Kolfly]**  
→ *n’hésite pas à ouvrir une issue ou une pull request pour contribuer.*

---

## 📄 Licence

Libre d’adaptation pour vos projets.
