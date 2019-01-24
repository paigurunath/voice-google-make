'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const SimpleResponse = require('actions-on-google').SimpleResponse;
const dialogflow = require('actions-on-google').dialogflow;
const request = require("request-promise");
const lodash = require('lodash');
const Speech = require('ssml-builder');

const audioPlayer = require("../responses/audioPlayer");
const errors = require("../responses/errors");
const library = require("../responses/library");
const main = require("../responses/main");
const notifications = require("../responses/notifications");
const helper = require('./helper');



// Instantiate the Dialogflow client.
const app = dialogflow();

app.intent('Default Welcome Intent', (conv) => {
    console.log("welcome");

    console.log('-------------------------------conv---------------------------------------');
    console.log(JSON.stringify(conv));
    console.log('-------------------------------conv---------------------------------------');
    
    var dataObj = {};
    dataObj.userid = conv.user._id;
    dataObj.skillid = conv.user._id;

    var options = {
      method: 'POST',
      uri: 'http://localhost:8090/user/getUserVisitCountOnSkill',
      body: dataObj,
      json: true // Automatically stringifies the body to JSON
    };

    var promiseObj = new Promise(function(resolve, reject) {
        request(options)
            .then(function (result) {
                resolve(result);
            })
            .catch(function (err) {
                reject();
            });
    });

    return promiseObj.then(function(result) {
      console.log('in promise then');

      if(result.visit_count < 2)  {
        helper.newWelcomeIntent(conv);
      } else  {
        helper.welcomeIntent(conv);
      }
    })
    .catch(function(err) {
      console.log('in promise catch');
      console.log(err);
      helper.newWelcomeIntent(conv);
    });
});

app.intent('YesIntent', (conv) => {

    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in YesIntent");
    return helper.latestIntent(conv);
});

app.intent('EpisodeIntent', (conv, params) => {

    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in EpisodeIntent");
    console.log('params from Episode Intent : ' + JSON.stringify(params));
    return helper.episodeIntent(conv, params);
});

app.intent('SubjectIntent', (conv, params) => {

    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in SubjectIntent");
    console.log('params from SubjectIntent : ' + JSON.stringify(params));
    return helper.subjectIntent(conv, params);
});

app.intent('HelpIntent', (conv) => {

    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in HelpIntent");
    var speech = new Speech();
    speech.audio(lodash.sample(errors.help.prompt));
    //make it ssml
    var speechOutput = speech.ssml();

    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: "Help",
    }));
});

app.intent('NoIntent', (conv) => {

    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in NoIntent");
    console.log('Previous Intent : ' +  conv.data.previousIntent );

    if(conv.data.previousIntent === 'Default Welcome Intent') {
        
        helper.sessionEndedRequest(conv);
    } else {

        var speech = new Speech();
        speech.audio(lodash.sample(notifications.no.prompt));
        speech.audio(lodash.sample(notifications.welcome.newUser));
        //make it ssml
        var speechOutput = speech.ssml();

        conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: "Good bye",
        }));
    }
});

app.intent('WhoIsIntent', (conv) => {

    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in WhoIsIntent");
    var speech = new Speech();
    speech.audio(main.bio.prompt);
    //make it ssml
    var speechOutput = speech.ssml();

    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: "Who is",
    }));
});

app.intent('LibraryIntent', (conv) => {

    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in LibraryIntent");
    var speech = new Speech();
    speech.audio(library.intro.prompt);
    //make it ssml
    var speechOutput = speech.ssml();

    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: "Intro",
    }));
});

app.intent('DescriptionIntent', (conv) => {

    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in DescriptionIntent");
    var speech = new Speech();
    speech.audio(library.description.prompt);
    //make it ssml
    var speechOutput = speech.ssml();

    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: "Description",
    }));
});

app.intent('MoreIntent', (conv) => {

    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in MoreIntent");

    var speech = new Speech();
    speech.audio(main.bio.prompt);
    //make it ssml
    var speechOutput = speech.ssml();

    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: "Who is",
    }));
});

// app.intent('Default Fallback Intent', (conv) => {
app.fallback((conv) => {

    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("going to fallback...")

    // console.log('-----------------fallback ------------------------');
    // console.log(JSON.stringify(conv));
    // console.log('-----------------fallback ------------------------');
    var speech = new Speech();
    speech.audio(lodash.sample(library.unhandled.prompt));
    //make it ssml
    var speechOutput = speech.ssml();

    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: "Fallback",
    }));
});


module.exports = app;