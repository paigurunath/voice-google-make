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
    helper.card(conv, welcome[USER_TYPE]);
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
    var speechTxt = utils.addAudio("", lodash.sample(notes.intro.preprompt), "");
    //adding REPROMPT
    speechTxt = utils.addAudio(speechTxt, notes.preview.prompt, notes.preview.altText);
    speechTxt = utils.addAudio(speechTxt, notes.preview.reprompt, notes.intro.altText);
    speechTxt = utils.addSpeak(speechTxt);

    //SPEECH
    conv.ask(new SimpleResponse({
        speech: speechTxt,
        text: "",
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
    var speechTxt = utils.addAudio("", aboutDr.prompt, aboutDr.altText);
    speechTxt = utils.addBreak(speechTxt, '500ms');
    //adding REPROMPT
    speechTxt = utils.addAudio(speechTxt, general.prompt, general.altText);
    speechTxt = utils.addSpeak(speechTxt);

    //partially implemented
    conv.ask(new SimpleResponse({
        speech: speechTxt,
        text: '',
    }));

});

app.intent('QuoteIntent', (conv) => {
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;
    console.log('in quote ')
    //adding SPEECH
    var speechTxt = utils.addAudio("", lodash.sample(quote.prompt), quote.altText);
    speechTxt = utils.addBreak(speechTxt, '500ms');
    //adding REPROMPT
    speechTxt = utils.addAudio(speechTxt, general.prompt, general.altText);
    speechTxt = utils.addSpeak(speechTxt);

    //partially implemented
    conv.ask(new SimpleResponse({
        speech: speechTxt,
        text: '',
    }));

});

app.intent('WhatIsThisIntent', (conv) => {
    conv.data.previousIntent = conv.data.currentIntent;
    conv.data.currentIntent = conv.intent;
    console.log('in what is this quote ')
    //adding SPEECH
    var speechTxt = utils.addAudio("", whatIsThis.prompt, whatIsThis.altText);
    speechTxt = utils.addBreak(speechTxt, '500ms');
    //adding REPROMPT
    speechTxt = utils.addAudio(speechTxt, general.prompt, general.altText);
    speechTxt = utils.addSpeak(speechTxt);

    //partially implemented
    conv.ask(new SimpleResponse({
        speech: speechTxt,
        text: '',
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
    console.log('in PauseIntent');

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