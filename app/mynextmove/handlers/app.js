'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const SimpleResponse = require('actions-on-google').SimpleResponse;

const dialogflow = require('actions-on-google').dialogflow;

const lodash = require('lodash');
const audioPlayer = require("../responses/audioPlayer");
const errors = require("../responses/errors");
const library = require("../responses/library");
const main = require("../responses/main");
const notifications = require("../responses/notifications");
const helper = require('../helper');

// Instantiate the Dialogflow client.
const app = dialogflow();

app.intent('Default Welcome Intent', (conv) => {
    console.log("welcome");

    conv.noInputs
    let USER_TYPE = '';
    conv.user.storage.convstate = '';

    if(conv.user.storage.visit)   {
        console.log("in if");
        USER_TYPE = parseInt(conv.user.storage.visit, 10) < 2
			? 'newUser'
			: 'returningUser'
        ;
    } else {
        console.log("in else");
        USER_TYPE = 'newUser';
    }

    console.log(USER_TYPE);

    if(conv.user.storage.visit) {
        var countVisit = conv.user.storage.visit;
        countVisit = parseInt(countVisit, 10);
        countVisit++;
        conv.user.storage.visit = countVisit;
    } else {
        conv.user.storage.visit = 1;
    }
    // helper.card(conv, welcome[USER_TYPE]);
    helper.newWelcomeIntent(conv);
});

app.intent('YesIntent', (conv) => {
    console.log("in YesIntent");
    new Promise(function(resolve, reject) {
        helper.yesIntent(conv);
    });
});


// app.intent('Default Fallback Intent', (conv) => {
app.fallback((conv) => {
    console.log("going to fallback...")

    console.log('-----------------fallback ------------------------');
    console.log(JSON.stringify(conv));
    console.log('-----------------fallback ------------------------');

    // helper.getFallbackIntent(conv);  
});


module.exports = app;