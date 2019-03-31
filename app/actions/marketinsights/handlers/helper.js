const {
    BasicCard,
    Image,
    Button,
    SimpleResponse,
    MediaObject,
    Suggestions
} = require('actions-on-google');
const lodash = require('lodash');
const Speech = require('ssml-builder');

const { unhandled, goodbye, help } = require("../responses/exceptions");
const disclosures = require("../responses/disclosures");
const commentary =  require("../responses/commentary");
const { commentariesById } = require("../responses/commentaryMap");
const notes = require("../responses/notes");

module.exports = {
    stop(conv) {
        
        // var speechTxt = utils.addAudio("", lodash.sample(goodbye.prompt), goodbye.altText);
        // speechTxt = utils.addSpeak(speechTxt);

        // return conv.close(new SimpleResponse({
        //     speech: speechTxt,
        //     text: '',
        // }));

        var speech = new Speech();
        speech.audio(lodash.sample(goodbye.prompt))
        speech.say(goodbye.altText)
        //make it ssml
        var speechOutput = speech.ssml();

        return conv.close(new SimpleResponse({
            speech: speechOutput,
            text: goodbye.altText
        }));
    },
    card(conv, txtObj) {
    
        console.log("from helper welcome");
        const CARD = disclosures.card;
        const response = [];

        var speech = new Speech();
        speech.audio(txtObj.prompt)
        //make it ssml
        var speechOutput = speech.ssml();

        response.push(new SimpleResponse({
            speech: speechOutput,
            text: txtObj.altText,
        }));

        //'https://s3.amazonaws.com/alexa-chase-voice/image/alexa_card_logo_small.png', 'https://s3.amazonaws.com/alexa-chase-voice/image/alexa_card_logo_large.png'
        response.push(new BasicCard({
                text: CARD.body,
                title: CARD.title,
                subtitle: 'Market Insights',
                buttons: new Button({
                title: CARD.button.text,
                url: CARD.button.link
            }),
            image: new Image({
                url: 'https://s3.amazonaws.com/alexa-chase-voice/image/alexa_card_logo_large.png',
                alt: 'Market Insights',
                width: '720',
                height: '480'
            }),
            display: 'CROPPED'
        }));
        return conv.ask(...response);
    },

    playAudio(conv) {

        console.log("in play audio");
        // var speechTxt = utils.addAudio("", notes.stories.audio, notes.intro.altText);
        // speechTxt = utils.addSpeak(speechTxt);

        var speechTxt = 'Notes';

        var speech = new Speech();
        speech.say(speechTxt)
        //make it ssml
        var speechOutput = speech.ssml();
        // speechTxt = utils.addSpeak(speechTxt);

        conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: '',
        }));

        conv.ask(new MediaObject({
            name: notes.stories.altText,
            url: notes.stories.audio,
            description: notes.stories.altText,
            icon: new Image({
                url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
                alt: 'Media icon',
            }),
        }));

        return conv.ask(new Suggestions("Notes"));
    },

    createSimpleResponseObj(conv, audioObj, audioTxt) {

        console.log("from createSimpleResponseObj");

        var speech = new Speech();
        speech.audio(audioObj)
        //make it ssml
        var speechOutput = speech.ssml();

        // var speechTxt = utils.addAudio("", audioObj, audioTxt);
        // speechTxt = utils.addSpeak(speechTxt);

        return conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: audioTxt,
        }));
    },

    createCommentaryOnId(conv, commentaryId) {

        console.log("commentary number from  createCommentaryOnId : " + parseInt(commentaryId, 10));
        var selectedNumber = parseInt(commentaryId, 10);
        const selectedCommentary = commentariesById[selectedNumber];

        console.log("from selected commentary");
        console.log(selectedCommentary);

        if(selectedCommentary) {
            //create the object to be stored in session
            var commentaryObj = {
                "commentaryError": 0,
                "commentary": selectedNumber,
                "commentaryNumber": selectedNumber
            }

            //store the object in session
            conv.data.commentaryObj = commentaryObj;
            console.log('selected one object : ' + JSON.stringify(selectedCommentary));

            var speech = new Speech();
            speech.audio(selectedCommentary.audio)
            //make it ssml
            var speechOutput = speech.ssml();
            
            //selected commentary
            // var speechTxt = utils.addAudio("", selectedCommentary.audio, selectedCommentary.altText);
            // speechTxt = utils.addSpeak(speechTxt);

            return conv.ask(new SimpleResponse({
                speech: speechOutput,
                text: selectedCommentary.altText
            }));
        } else {
            console.log('in else from commentary, going to enter help');
            this.getHelpIntent(conv);
        }
    }, 

    getHelpIntent(conv) {

        console.log("conv.data.currentIntent : " +  conv.data.currentIntent);
        console.log("conv.data.previousIntent : " +  conv.data.previousIntent);


        console.log("from gethelp intent");
        if(conv.user.storage.convstate && conv.user.storage.convstate.toString().trim() == 'notes') {

            conv.user.storage.convstate = '';

            console.log('inside if help');
            // conv.user.storage.generalError = 0;
            // var speechTxt = utils.addAudio("", lodash.sample(notes.help.prompt), notes.help.altText);
            // speechTxt = utils.addSpeak(speechTxt);

            var speech = new Speech();
            speech.audio(lodash.sample(notes.help.prompt))
            //make it ssml
            var speechOutput = speech.ssml();
            
            //check difference between ._sample and play for jovo framework
            return conv.ask(new SimpleResponse({
                speech: speechOutput,
                text: notes.help.altText,
            }));
        } else if (conv.user.storage.convstate && conv.user.storage.convstate.toString().trim() == 'commentary') {
            console.log('inside else if  help');
            
            conv.user.storage.convstate = '';
            //set this to zero
            conv.user.storage.commentaryError = 0;

            // var speechTxt = utils.addAudio("", lodash.sample(commentary.help.prompt), commentary.help.altText);
            // speechTxt = utils.addSpeak(speechTxt);
    
            var speech = new Speech();
            speech.audio(lodash.sample(commentary.help.prompt))
            //make it ssml
            var speechOutput = speech.ssml();

            //check difference between ._sample and play for jovo framework
            return conv.ask(new SimpleResponse({
                speech: speechOutput,
                text: commentary.help.altText,
            }));
    
        } else {
            console.log('inside else help');
            conv.user.storage.generalError = 0
            
            // var speechTxt = utils.addAudio("", lodash.sample(help.prompt), help.altText);
            // speechTxt = utils.addSpeak(speechTxt);
    
            var speech = new Speech();
            speech.audio(lodash.sample(help.prompt))
            //make it ssml
            var speechOutput = speech.ssml();

            return conv.ask(new SimpleResponse({
                speech: speechOutput,
                text: help.altText,
            }));
        }
    },

    getFallbackIntent(conv) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;
        console.log('in Default Fallback Intent intent');

        if(conv.user.storage.convstate && conv.user.storage.convstate.toString().trim() == 'notes') {

            conv.user.storage.generalError = 0;
            this.getHelpIntent(conv);
            
        } else if(conv.user.storage.convstate && conv.user.storage.convstate.toString().trim() == 'commentary') {

            const commentaryError = conv.user.storage.commentaryError || 0;
            conv.user.storage.commentaryError = (parseInt(commentaryError, 10) <= 0) ? 1 : parseInt(commentaryError, 10) + 1;

            if (!commentaryError) {
                this.createSimpleResponseObj(conv, lodash.sample(commentary.invalid.first), commentary.invalid.altText);
            } else if (commentaryError < 2) {
                this.createSimpleResponseObj(conv, lodash.sample(commentary.invalid.second), commentary.invalid.altText);
            } else {
                this.getHelpIntent(conv);
            }
        } else {

            const generalError = conv.user.storage.generalError || 0;
            conv.user.storage.generalError = (parseInt(generalError, 10) <= 0) ? 1 : parseInt(generalError, 10) + 1;

            if (generalError < 2) {
                this.createSimpleResponseObj(conv, lodash.sample(unhandled.prompt), unhandled.altText);
            } else {
                this.getHelpIntent(conv);
            }
        }


        if(conv.user.storage.generalError) {
            console.log("general 1");
            if( conv.user.storage.generalError === 'undefined') {
                console.log("general 2");
                conv.user.storage.generalError = 1

                var speech = new Speech();
                speech.audio(lodash.sample(unhandled.prompt))
                //make it ssml
                var speechOutput = speech.ssml();

                // var speechTxt = utils.addAudio("", lodash.sample(unhandled.prompt), unhandled.altText);
                // speechTxt = utils.addSpeak(speechTxt);

                conv.close(new SimpleResponse({
                    speech: speechOutput,
                    text: unhandled.altText,
                }));

            } else if(parseInt(conv.user.storage.generalError, 10) < 2) {

                console.log("general 3");
                conv.user.storage.generalError = parseInt(conv.user.storage.generalError, 10) +  1;

                // var speechTxt = utils.addAudio("", lodash.sample(unhandled.prompt), unhandled.altText);
                // speechTxt = utils.addSpeak(speechTxt);
                var speech = new Speech();
                speech.audio(lodash.sample(unhandled.prompt))
                //make it ssml
                var speechOutput = speech.ssml();
                
                conv.close(new SimpleResponse({
                    speech: speechOutput,
                    text: unhandled.altText,
                }));
            }
            
        }  else {
            this.getHelpIntent(conv);
        }
    }
};

