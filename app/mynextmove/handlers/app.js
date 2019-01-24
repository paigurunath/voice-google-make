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
var Speech = require('ssml-builder');

const request = require("request-promise");
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
    // conv.noInputs
    // let USER_TYPE = '';
    // conv.user.storage.convstate = '';

    // if(conv.user.storage.visit)   {
    //     console.log("in if");
    //     USER_TYPE = parseInt(conv.user.storage.visit, 10) < 2
	// 		? 'newUser'
	// 		: 'returningUser'
    //     ;
    // } else {
    //     console.log("in else");
    //     USER_TYPE = 'newUser';
    // }

    // console.log(USER_TYPE);

    // if(conv.user.storage.visit) {
    //     var countVisit = conv.user.storage.visit;
    //     countVisit = parseInt(countVisit, 10);
    //     countVisit++;
    //     conv.user.storage.visit = countVisit;
    // } else {
    //     conv.user.storage.visit = 1;
    // }
    // // helper.card(conv, welcome[USER_TYPE]);
    // helper.newWelcomeIntent(conv);
});

app.intent('YesIntent', (conv) => {

    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in YesIntent");
    // new Promise(function(resolve, reject) {
        return helper.latestIntent(conv);
    // });
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

    // if(!titles.length) {
    //     let speech = this.speechBuilder()
    //         .addAudio(library.nocontent.prompt, "$")

    //     let reprompt = this.speechBuilder()
    //         .addAudio(library.nocontent.prompt, "$")

    //     this.ask(speech, reprompt);
    // } else {
    //     const data =  {
    //         titles: titles,
    //         prompt: moreEpisodes.prompt,
    //         reprompt: moreEpisodes.reprompt,
    //         repromptMore: moreEpisodes.repromptMore
    //     }
    //     this.toStateIntent(state.LIBRARY, 'PromptEpisodes', data);
    // }


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