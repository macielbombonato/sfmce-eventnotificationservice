const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const memoryDB = require('../db/memory');

const app = express();
app.use(bodyParser.json());

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin_password';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '3600s';

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {
        // Gerar um token JWT
        const expiresIn = JWT_EXPIRATION;
        const token = jwt.sign({ clientKey: username }, JWT_SECRET, { expiresIn });

        // Calcular o timestamp de validade do token
        const expirationTimestamp = Math.floor(Date.now() / 1000) + parseInt(expiresIn);

        res.status(200).json({ token, expiresAt: expirationTimestamp });
    } else {
        return res.status(401).send('Credenciais inválidas');
    }
});


// Middleware para verificar o token JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Token não fornecido');
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, client) => {
    if (err) {
      return res.status(403).send('Token inválido');
    }

    req.client = client;
    next();
  });
};

// Route to get all items from the in-memory database
app.get('/items', authenticateJWT, (req, res) => {
    const items = memoryDB.getAllItems();
    res.json(items);
});

// Route to add a new item to the in-memory database
app.post('/items', authenticateJWT, (req, res) => {
    const newItem = req.body;
    memoryDB.addItem(newItem);
    res.status(201).json(newItem);
});

// Additional routes can be added here
module.exports = app;