'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    BasicCard,
    Image,
    Button,
    SimpleResponse
} = require('actions-on-google');

const Contexts = {
    NOTES: 'notes',
    COMMENTARY: 'commentary'
};

const contextParameters = {
    commentary: 'commentary',
};

const contextParametersNotes = {
    notes: 'notes',
};

const lodash = require('lodash');
const welcome = require("./responses/welcome");
const disclosures = require("./responses/disclosures");
const notes = require("./responses/notes");
const commentary =  require("./responses/commentary");
const { general, aboutDr, quote, whatIsThis } = require("./responses/easterEggs");
const { unhandled, goodbye, help } = require("./responses/exceptions");
const { commentariesById, allCommentaryIds } = require("./responses/commentaryMap");

const utils = require("./util");
const helper = require("./helper");
// Instantiate the Dialogflow client.
const app = dialogflow();

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.

const CARD = disclosures.card;

const response = [];

//welcomeuser intent implementation from welcome.js
app.intent('Default Welcome Intent', (conv) => {
    console.log("welcome");

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
    helper.card(conv, disclosures);
});

// PlayNotesIntent and redirected NotesOnTheWeekAheadIntent implementation from notes.js
app.intent('NotesOnTheWeekAheadIntent', (conv) => {

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
    console.log('in no intent');
    helper.stop(conv);
});

app.intent('CancelIntent', (conv) => {
    console.log('in cancel intent');
    helper.stop(conv);
});

app.intent('StopIntent', (conv) => {
    console.log('in stop intent from helper js');
    helper.stop(conv);
});

app.intent('KeepReadingIntent', (conv) => {
    console.log('in KeepReadingIntent');
    helper.stop(conv);
});


app.intent('PlayClipForIntent', (conv) => {
   
    console.log("in PlayClipForIntent");

    conv.user.storage.convstate = 'commentary';

    console.log('session from commentary');
    console.log(conv.user.storage.convstate);

    var selectedNumber = 4;
    helper.createCommentaryOnId(conv, selectedNumber);
});

app.intent('PauseIntent', (conv) => {
    //paste unhandled code
});

app.intent('ResumeIntent', (conv) => {

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
    console.log('in Default Fallback Intent intent');

    if(conv.user.storage.convstate.toString().trim() == 'notes') {

        conv.user.storage.generalError = 0;
        helper.getHelpIntent(conv);
        
    } else if(conv.user.storage.convstate.toString().trim() == 'commentary') {

        const commentaryError = conv.user.storage.commentaryError || 0;
        conv.user.storage.commentaryError = (parseInt(commentaryError, 10) <= 0) ? 1 : parseInt(commentaryError, 10) + 1;

        if (!commentaryError) {
            helper.createSimpleResponseObj(conv, lodash.sample(commentary.invalid.first), commentary.invalid.altText);
		} else if (commentaryError < 2) {
            helper.createSimpleResponseObj(conv, lodash.sample(commentary.invalid.second), commentary.invalid.altText);
		} else {
			helper.getHelpIntent(conv);
		}
    } else {

        const generalError = conv.user.storage.generalError || 0;
        conv.user.storage.generalError = (parseInt(generalError, 10) <= 0) ? 1 : parseInt(generalError, 10) + 1;

        if (generalError < 2) {
            helper.createSimpleResponseObj(conv, lodash.sample(unhandled.prompt), unhandled.altText);
		} else {
			helper.getHelpIntent(conv);
        }
    }


    if(conv.user.storage.generalError) {
        console.log("general 1");
        if( conv.user.storage.generalError === 'undefined') {
            console.log("general 2");
            conv.user.storage.generalError = 1

            var speechTxt = utils.addAudio("", lodash.sample(unhandled.prompt), unhandled.altText);
            speechTxt = utils.addSpeak(speechTxt);

            conv.close(new SimpleResponse({
                speech: speechTxt,
                text: '',
            }));

        } else if(parseInt(conv.user.storage.generalError, 10) < 2) {

            console.log("general 3");
            conv.user.storage.generalError = parseInt(conv.user.storage.generalError, 10) +  1;

            var speechTxt = utils.addAudio("", lodash.sample(unhandled.prompt), unhandled.altText);
            speechTxt = utils.addSpeak(speechTxt);

            conv.close(new SimpleResponse({
                speech: speechTxt,
                text: '',
            }));
        }
        
    }  else {
        helper.getHelpIntent(conv);
    }
});

//HelpIntent
app.intent('HelpIntent', (conv) => {
    console.log("in help intent");
    helper.getHelpIntent(conv);
});

module.exports = app;