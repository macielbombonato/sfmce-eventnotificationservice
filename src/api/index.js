const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const request = require('sync-request');

app.use(bodyParser.json());

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
const SLACK_CHANNEL = process.env.SLACK_CHANNEL || 'general';

const mceENSCall = (req, res) => {
  
  var json = req.body;

  var categoryType;

  if (json.length > 0) {
    categoryType = json[0].eventCategoryType || "No categoryType provided";
  }

  if (!json) {
    return res.status(400).send('JSON body is empty.');
  } else {
    if (categoryType == "SendEvents.AutomationInstanceErrored") {
      res = sendSlackMessage(
        res, 
        "*MCE ENS - Automation Errored*",
        "```" + json[0].automationName + ": " + json[0].eventCategoryType + "```"
      );

    } else if (categoryType == "SendEvents.AutomationInstanceStarted") {

      res = sendSlackMessage(
        res, 
        "*MCE ENS - Automation Started*",
         "```" + json[0].automationName + ": " + json[0].eventCategoryType + "```"
      );

    } else if (categoryType == "SendEvents.AutomationInstanceStopped") {

      res = sendSlackMessage(
        res, 
        "*MCE ENS - Automation Stopped*",
         "```" + json[0].automationName + ": " + json[0].eventCategoryType + "```"
      );

    } else if (categoryType == "SendEvents.AutomationInstanceSkipped") {

      res = sendSlackMessage(
        res, 
        "*MCE ENS - Automation Skipped*",
         "```" + json[0].automationName + ": " + json[0].eventCategoryType + "```"
      );

    } else if (categoryType == "SendEvents.AutomationInstanceCompleted") {

      res = sendSlackMessage(
        res, 
        "*MCE ENS - Automation Completed*",
         "```" + json[0].automationName + ": " + json[0].eventCategoryType + "```"
      );

    } else {

      res = sendSlackMessage(
        res, 
        "*MCE ENS - Other*: ",
        "```" + JSON.stringify(json) + "```"
      );

    }
    
  }

  return res.status(res.statusCode).send('ENS call processed.');
}

function sendSlackMessage(res, messageType, message) {
  // messageType = "TEST-MACIEL_" + messageType; // For testing purposes

  try {

    // console.log("Sending Slack message:", messageType, message);
    // console.log("Sending Slack URL:", SLACK_WEBHOOK_URL);

    const data = {
        "channel": SLACK_CHANNEL,
        "text": messageType + ": " + message
    };

    const result = request('POST', SLACK_WEBHOOK_URL, {
        json: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    res.status(result.statusCode);
  } catch (e) {
    console.log("Error sending Slack message: " + JSON.stringify(e));
    res.status(500);
  }

  return res;
}

// Route to monitoring calls from MCE ENS related to automations
// To monitoring other types, you can create additional routes and change 
// the json reading logic accordingly
app.post('/automation', (req, res) => {
  try {
    var json = req.body;

    // Enable this for debugging purposes
    // console.log("Processing ENS call with message: ```" + JSON.stringify(json) + "```");

    if (json.verificationKey) {
      res = sendSlackMessage(
        res, 
        "*MCE ENS - Verification*",
        "*Key*: `" + json.verificationKey + "`"
      );

      res.status(200).send('Successfully verified ENS call.');

    } else {
      
      mceENSCall(req, res);

    }
    
  } catch (e) {
    console.error("Error processing ENS request:", e);
    res.status(500).send('Erro interno do servidor');
  }
});

// Additional routes can be added here
module.exports = app;