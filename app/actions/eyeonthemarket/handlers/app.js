const Speech = require('ssml-builder');
const lodash = require('lodash');
const request = require('request-promise');
const SimpleResponse = require('actions-on-google').SimpleResponse;
const MediaObject = require('actions-on-google').MediaObject;
const Image = require('actions-on-google').Image;
const Suggestions = require('actions-on-google').Suggestions;
const dialogflow = require('actions-on-google').dialogflow;

const easterEggs = require('../responses/easterEggs');
const exceptions = require('../responses/exceptions');
const welcome = require('../responses/welcome');
const helper = require('./helper');
const config = require('../../../config/config.json');

// const {actionssdk} = require('actions-on-google');
// const app = actionssdk({verification: 'voice-example1'});
// Instantiate the Dialogflow client.
// const app = dialogflow({debug: true});
const app = dialogflow();

app.intent('Default Welcome Intent', (conv) => {
    console.log('-----------------------------eyeOnTheMarket-middleware---log-----------------------------');
    console.log("welcome log : " + JSON.stringify(conv));
    console.log('-----------------------------eyeOnTheMarket-middleware---log-----------------------------');

    var dataObj = {};
    dataObj.userid = conv.user._id;
    dataObj.skillid = conv.user._id;

    var options = {
      method: 'POST',
      uri: config.dbServiceBase + config.dbService.getUserVisitCountOnSkill,
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

    var visitVal = 0;
    return promiseObj.then(function(result) {
        visitVal = result.visit_count;

        console.log("1 welcome");
        return helper.latestIntent(conv, visitVal); 
    })
    .catch(function(err) {
      console.log('in promise catch');
      console.log(err);
      console.log("2 welcome");
      return helper.latestIntent(conv, visitVal); 
    });
    
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

const intentSuggestions = [
    'Podcast'
  ];

// Handle a media status event
app.intent('actions.intent.MEDIA_STATUS', (conv) => {
    
    console.log('In media status');

    const mediaStatus = conv.arguments.get('MEDIA_STATUS');
    let response = 'Unknown media status received.';
    if (mediaStatus && mediaStatus.status === 'FINISHED') {
      response = 'Hope you enjoyed the tunes!';
    }
    conv.ask(response);
    conv.ask(new Suggestions(intentSuggestions));
  });

app.intent('PodcastIntent', (conv) => {
    console.log("in PodcastIntent");
   
    var dataObj = {};
    dataObj.userid = conv.user._id;
    dataObj.skillid = conv.user._id;

    var options = {
        method: 'POST',
        uri: config.dbServiceBase + config.dbService.getAudioUrlOnUserSkillId,
        body: dataObj,
        json: true // Automatically stringifies the body to JSON
    };

    console.log(1);
    var promiseObj = new Promise(function(resolve, reject) {
    request(options)
        .then(function (result) {
            console.log(2);
            resolve(result);

        })
        .catch(function (err) {
            console.log(3);
            reject();
        });
    });
    
    var visitVal = 0;
    var altText = 'Welcome!';

    return promiseObj.then(function(result) {
    console.log('--------------------------------resume related---------------------------------');

        if(result.visit_count) {
            visitVal = result.visit_count;
        }
        
        var speech = new Speech();
        
        if(visitVal < 2) {
            speech.audio(welcome.newUser.google);
        } else if(visitVal >= 2) {
            speech.audio(lodash.sample(welcome.subscribedUser.prompt));
            altText = 'Welcome Back!'
        }
        var speechOutput = speech.ssml();

        console.log(4);
        if(result.audiourl !== null){

            conv.ask(new SimpleResponse({
                speech: speechOutput,
                text: altText,
            }));
    
            console.log('befor going ahead');
            
            return conv.close(new MediaObject({
                name: 'Welcome',
                url: result.audiourl ,
                description: 'Welcome',
                icon: new Image({
                    url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
                    alt: 'Media icon',
                }),
            }));
    
            
            // return conv.ask(new Suggestions("Welcome"));
        } else {
            console.log(5);
            return helper.latestIntent(conv, visitVal); 
        }
    })
    .catch(function(err) {
        console.log(err)
        console.log(6);
        return helper.latestIntent(conv, visitVal); 
    });
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
