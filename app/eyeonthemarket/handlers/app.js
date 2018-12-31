const Speech = require('ssml-builder');
const lodash = require('lodash');
const request = require('request-promise');

const easterEggs = require('../responses/easterEggs');
const exceptions = require('../responses/exceptions');
const welcome = require('../responses/welcome');
const SimpleResponse = require('actions-on-google').SimpleResponse;
const MediaObject = require('actions-on-google').MediaObject;
const Image = require('actions-on-google').Image;
const Suggestions = require('actions-on-google').Suggestions;
const dialogflow = require('actions-on-google').dialogflow;
const helper = require('./helper');

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

    helper.latestIntent(conv); 
});

app.intent('NewContentIntent', (conv) => {
    console.log("in NewContentIntent");
    var speech = new Speech();
    speech.audio(easterEggs.newContent.prompt);
    //make it ssml
    var speechOutput = speech.ssml();

    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: easterEggs.newContent.altText,
    }));
});

app.intent('AboutMichaelIntent', (conv) => {
    console.log("in AboutMichaelIntent");
    var speech = new Speech();
    speech.audio(easterEggs.aboutMichael.prompt);
    //make it ssml
    var speechOutput = speech.ssml();

    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: easterEggs.aboutMichael.altText,
    }));
});

app.intent('HelpIntent', (conv) => {
    console.log("in HelpIntent");
    var speech = new Speech();
    speech.paragraph(exceptions.help.prompt);
    //make it ssml
    var speechOutput = speech.ssml();

    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: "Help",
    }));
});


app.fallback((conv) => {
    console.log("going to fallback...")

    var speech = new Speech();
    speech.paragraph(exceptions.unhandled.prompt);
    //make it ssml
    var speechOutput = speech.ssml();

    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: "Fallback",
    }));
});

//for session end or cancel or quit this should be called
app.intent('actions.intent.CANCEL', (conv) => {
    console.log("going to CANCEL/QUIT/SESSION end...")

    var speech = new Speech();
    speech.paragraph(exceptions.goodbye.prompt);
    //make it ssml
    var speechOutput = speech.ssml();

    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: "Good Bye.",
    }));
});

module.exports = app;
