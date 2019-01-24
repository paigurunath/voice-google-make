'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const SimpleResponse = require('actions-on-google').SimpleResponse;
const dialogflow = require('actions-on-google').dialogflow;
const Speech = require('ssml-builder');
const request = require("request-promise");
const lodash = require('lodash');

const welcome = require("../responses/welcome");
const disclosures = require("../responses/disclosures");
const notes = require("../responses/notes");
const commentary =  require("../responses/commentary");
const { general, aboutDr, quote, whatIsThis } = require("../responses/easterEggs");
const { commentariesById } = require("../responses/commentaryMap");
const helper = require("./helper");
const config = require('../../config/config.json');
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
      uri: config.dbServiceBase + config.getUserVisitCountOnSkill,
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

      var USER_TYPE = result.visit_count < 2 ? 'newUser' : 'returningUser'
      console.log(result.visit_count + ' visit count final ' + USER_TYPE + ' is the final ');

      helper.card(conv, welcome[USER_TYPE]);
   
    })
    .catch(function(err) {
      console.log('in promise catch');
      console.log(err);
      var USER_TYPE = 'newUser';
      helper.card(conv, welcome[USER_TYPE]);
    
      });
});

app.intent('DisclosuresIntent', (conv) => {
    console.log('in DisclosuresIntent');
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;
    
    helper.card(conv, disclosures);
});

// PlayNotesIntent and redirected NotesOnTheWeekAheadIntent implementation from notes.js
app.intent('NotesOnTheWeekAheadIntent', (conv) => {

    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;
    //managing conversation state
    //if(conv.user.storage.convstate) {
    conv.user.storage.convstate = 'notes';
    // }
    //partially implemented
    // conv.contexts.set(Contexts.NOTES, 5, contextParametersNotes);
    console.log('in notes ')
    console.log('------------------------------')
    console.log(conv.user.storage.convstate);
    //adding SPEECH
    // var speechTxt = utils.addAudio("", lodash.sample(notes.intro.preprompt), "");
    // //adding REPROMPT
    // speechTxt = utils.addAudio(speechTxt, notes.preview.prompt, notes.preview.altText);
    // speechTxt = utils.addAudio(speechTxt, notes.preview.reprompt, notes.intro.altText);
    // speechTxt = utils.addSpeak(speechTxt);
    var speech = new Speech();
    speech.audio(lodash.sample(notes.intro.preprompt))
    speech.audio(notes.preview.prompt)
    speech.audio(notes.preview.reprompt)

    //make it ssml
    var speechOutput = speech.ssml();

    //SPEECH
    return conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: notes.intro.altText,
    }));

});

//YesIntent 
app.intent('YesIntent', (conv) => {
    
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log('in yes intent');

    if (!conv.surface.capabilities.has("actions.capability.MEDIA_RESPONSE_AUDIO")) {
        conv.ask("The media response audio surface is not supported for the user's device.");
        return;
    }
    //verify all the required parameters
    helper.playAudio(conv);
});

//PlayCommentary
app.intent('CommentaryIntent', (conv, params) => {
   
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in comentary");
    conv.user.storage.convstate = 'commentary';

    console.log('session from commentary');
    console.log(conv.user.storage.convstate);

    console.log("commentary params : " + JSON.stringify(params));

    if(params.commentaryNumber === "") {
        //handle without when there is only commentary this is without the commentary number. Initial initiation.
        helper.createSimpleResponseObj(conv, lodash.sample(commentary.intro.prompt), commentary.intro.altText)
    } else {
        helper.createCommentaryOnId(conv, params.commentaryNumber);
    }
});

//PlayCommentary
app.intent('NextMessageIntent', (conv) => {
 
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in NextMessageIntent");
    conv.user.storage.convstate = 'commentary';

    if(conv.data.commentaryObj) {
        //handle without when there is only commentary this is without the commentary number. Initial initiation.

        var commentaryObj = conv.data.commentaryObj
        const curCommentaryNum = commentaryObj.commentary || 0;
        const nextCommentaryNum = curCommentaryNum + 1;

        if(commentariesById[nextCommentaryNum]) {
            helper.createCommentaryOnId(conv, nextCommentaryNum);
        } else {
            helper.createSimpleResponseObj(conv, lodash.sample(commentary.last.prompt), commentary.last.altText);
        }
    }
});


//PlayAgainIntent
app.intent('PlayAgainIntent', (conv) => {
 
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in PlayAgainIntent");
    conv.user.storage.convstate = 'commentary';

    if(conv.data.commentaryObj) {
        //handle without when there is only commentary this is without the commentary number. Initial initiation.
        var commentaryObj = conv.data.commentaryObj
        const curCommentaryNum = commentaryObj.commentary || 0;
        const nextCommentaryNum = curCommentaryNum;

        if(commentariesById[nextCommentaryNum]) {
            helper.createCommentaryOnId(conv, nextCommentaryNum);
        } else {
            helper.createSimpleResponseObj(conv, lodash.sample(commentary.last.prompt), commentary.last.altText);
        }
    }
});


//easterEggs complete , pending is redirection and template
app.intent('AboutDrKellyIntent', (conv) => {
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;
    console.log('in davi kelly ')
    //adding SPEECH
    // var speechTxt = utils.addAudio("", aboutDr.prompt, aboutDr.altText);
    // speechTxt = utils.addBreak(speechTxt, '500ms');
    // //adding REPROMPT
    // speechTxt = utils.addAudio(speechTxt, general.prompt, general.altText);
    // speechTxt = utils.addSpeak(speechTxt);

    var speech = new Speech();
    speech.audio(aboutDr.prompt)
    speech.pause('500ms')
    speech.audio(general.prompt)

    //make it ssml
    var speechOutput = speech.ssml();

    //partially implemented
    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: general.altText,
    }));

});

app.intent('QuoteIntent', (conv) => {
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;
    console.log('in quote ')
    // //adding SPEECH
    // var speechTxt = utils.addAudio("", lodash.sample(quote.prompt), quote.altText);
    // speechTxt = utils.addBreak(speechTxt, '500ms');
    // //adding REPROMPT
    // speechTxt = utils.addAudio(speechTxt, general.prompt, general.altText);
    // speechTxt = utils.addSpeak(speechTxt);

    var speech = new Speech();
    speech.audio(lodash.sample(quote.prompt))
    speech.pause('500ms')
    speech.audio(general.prompt)

    //make it ssml
    var speechOutput = speech.ssml();

    //partially implemented
    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: general.altText,
    }));

});

app.intent('WhatIsThisIntent', (conv) => {
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;
    console.log('in what is this quote ')
    // //adding SPEECH
    // var speechTxt = utils.addAudio("", whatIsThis.prompt, whatIsThis.altText);
    // speechTxt = utils.addBreak(speechTxt, '500ms');
    // //adding REPROMPT
    // speechTxt = utils.addAudio(speechTxt, general.prompt, general.altText);
    // speechTxt = utils.addSpeak(speechTxt);

    var speech = new Speech();
    speech.audio(whatIsThis.prompt)
    speech.pause('500ms')
    speech.audio(general.prompt)

    //make it ssml
    var speechOutput = speech.ssml();

    //partially implemented
    conv.ask(new SimpleResponse({
        speech: speechOutput,
        text: general.altText,
    }));


});

//NoIntent 
app.intent('NoIntent', (conv) => {
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;
    console.log('in no intent');
    helper.stop(conv);
});

app.intent('CancelIntent', (conv) => {
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;
    console.log('in cancel intent');
    helper.stop(conv);
});

app.intent('StopIntent', (conv) => {
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;
    console.log('in stop intent from helper js');
    helper.stop(conv);
});

app.intent('KeepReadingIntent', (conv) => {
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;
    console.log('in KeepReadingIntent');
    helper.stop(conv);
});


app.intent('PlayClipForIntent', (conv) => {
   
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    console.log("in PlayClipForIntent");

    conv.user.storage.convstate = 'commentary';

    console.log('session from commentary');
    console.log(conv.user.storage.convstate);

    var selectedNumber = 4;
    helper.createCommentaryOnId(conv, selectedNumber);
});

app.intent('PauseIntent', (conv) => {
    console.log('----------------------------pause ------------------------------');
    console.log('in PauseIntent');
    console.log('----------------------------pause ------------------------------');
    
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    //sending to unhandled intent test whether it is working.
    //paste unhandled code
    helper.getFallbackIntent(conv);
});

app.intent('ResumeIntent', (conv) => {
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;

    //check to get the offset and use mediaresponse
    console.log('in ResumeIntent');
    if (!conv.surface.capabilities.has("actions.capability.MEDIA_RESPONSE_AUDIO")) {
        conv.ask("The media response audio surface is not supported for the user's device.");
        return;
    }

    //verify all the required parameters
    helper.playAudio(conv);
});



// app.intent('Default Fallback Intent', (conv) => {
app.fallback((conv) => {
    console.log("going to fallback...")

    console.log('-----------------fallback ------------------------');
    console.log(JSON.stringify(conv));
    console.log('-----------------fallback ------------------------');

    helper.getFallbackIntent(conv);  
});

//HelpIntent
app.intent('HelpIntent', (conv) => {
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;
    console.log("in help intent");
    helper.getHelpIntent(conv);
});

module.exports = app;