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

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';

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

const mceENSCall = (req, res) => {
  const { verificationKey, json } = req.body;

  const messageKey = json[0].messageKey || "No messageKey provided";

  if (!verificationKey || !json) {
    return res.status(400).send('Chave de verificação ou JSON não fornecido');
  } else {
    if (messageKey == "SendEvents.AutomationInstanceErrored") {
      sendSlackMessage(
        "Automation Errored",
        json[0].automationName + ": " + json[0].eventCategoryType
      );

    } else if (messageKey == "SendEvents.AutomationInstanceStarted") {

      sendSlackMessage(
        "Automation Started",
        json[0].automationName + ": " + json[0].eventCategoryType
      );

    } else if (messageKey == "SendEvents.AutomationInstanceStopped") {

      sendSlackMessage(
        "Automation Stopped",
        json[0].automationName + ": " + json[0].eventCategoryType
      );

    } else if (messageKey == "SendEvents.AutomationInstanceSkipped") {

      sendSlackMessage(
        "Automation Skipped",
        json[0].automationName + ": " + json[0].eventCategoryType
      );

    } else if (messageKey == "SendEvents.AutomationInstanceCompleted") {

      sendSlackMessage(
        "Automation Completed",
        json[0].automationName + ": " + json[0].eventCategoryType
      );

    } else if (verificationKey) {

      sendSlackMessage(
        "Verification",
        "ENS verificationKey: " + verificationKey
      );

    } else {

      sendSlackMessage(
        "Other: ",
        Stringify(json)
      );

    }
    
  }

  // Processar a chamada ENS
  // Aqui você pode adicionar a lógica para lidar com o JSON recebido

  res.status(200).send('Chamada ENS processada com sucesso');
}

function sendSlackMessage(messageType, message) {
  messageType = "TEST-MACIEL_" + messageType; // For testing purposes

  try {
    var apiCall = HTTP.Post(
      SLACK_WEBHOOK_URL,
      "application/json",
      Stringify({
        "channel": "martech_sync_status",
        "text": messageType + ": " + message
      })
    );

    var result = Platform.Function.ParseJSON(apiCall.Response[0]);

    if (result.StatusCode < 200 || result.StatusCode > 299) {
      Write("<br>Error creating alarm: " + Stringify(result));
    } else {
      Write("<br>Slack message sent successfully.");
    }
  } catch (e) {
    Write("<br>Error sending Slack message: " + Stringify(e));
  }
}

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

// Route to add a new item to the in-memory database
app.post('/ens', (req, res) => {
  mceENSCall(req, res)
});

// Additional routes can be added here
module.exports = app;