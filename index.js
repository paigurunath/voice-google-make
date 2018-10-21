'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');
const express = require('express')
const bodyParser = require('body-parser')
var marketInsights = require('./app/marketinsights/app');

const expressApp = express().use(bodyParser.json())
 
expressApp.post('/voice/google/marketinsights', marketInsights)
 
// expressApp.listen(process.env.PORT);
expressApp.listen(80)
console.log("Server started and running on port!!! 80");