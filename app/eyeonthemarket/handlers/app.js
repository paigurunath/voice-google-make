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

const feedUrl = "https://am.jpmorgan.com/us/en/asset-management/gim/adv/alexarss/voice-insights/Eye-on-the-Market";
const AudioFeed = require('../libs/audio-feed-api');
const audioFeed = new AudioFeed(feedUrl);

// Instantiate the Dialogflow client.
const app = dialogflow();

app.intent('Default Welcome Intent', (conv) => {
    console.log("welcome");

    var dataObj = {};
    dataObj.userid = conv.user._id;
    dataObj.skillid = conv.user._id;

    var options = {
      method: 'POST',
      uri: feedUrl,
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

      // if (!this.user().data.subscription) this.user().data.subscription = false;
      // const subCheck = this.user().data.subscription;
      const subCheck = false;
      const USER_TYPE = result.visit_count < 2 ? 'newUser' : subCheck ? 'subscribedUser' : 'returningUser'
      
      var speech = new Speech();
        var altText = 'Welcome';
 
      if(result.visit_count < 2) {
        speech.audio(welcome.newUser.google);
        
      } else if(result.visit_count >= 2) {
        speech.audio(lodash.sample(welcome.subscribedUser.prompt));
        altText = 'Welcome back! ';
      }

      var speechOutput = speech.ssml(true);
     
      conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: altText,
      }));

      return helper.latestIntent(conv); 
    })
    .catch(function(err) {
      console.log('in promise catch');
      console.log(err);
      return helper.latestIntent(conv); 
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
