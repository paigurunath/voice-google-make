const {
    dialogflow,
    BasicCard,
    Image,
    Button,
    SimpleResponse,
    MediaObject,
    Suggestions
} = require('actions-on-google');

const { unhandled, goodbye, help } = require("./responses/exceptions");
const disclosures = require("./responses/disclosures");
const commentary =  require("./responses/commentary");
const { commentariesById, allCommentaryIds } = require("./responses/commentaryMap");
const notes = require("./responses/notes");

const utils = require("./util");
const lodash = require('lodash');
// exports.commentary = function(pretext){
//     return `<speak> ${pretext.toString()} </speak>`;
// }

module.exports = {
    stop(conv) {
        
        var speechTxt = utils.addAudio("", lodash.sample(goodbye.prompt), goodbye.altText);
        speechTxt = utils.addSpeak(speechTxt);

        return conv.close(new SimpleResponse({
            speech: speechTxt,
            text: '',
        }));
    },
// };

// module.exports = {
    card(conv, txtObj) {
    
        console.log("from helper welcome");
        const CARD = disclosures.card;
        const response = [];

        var speechTxt = utils.addAudio("", txtObj.prompt, txtObj.altText);
        speechTxt = utils.addSpeak(speechTxt);
        
        response.push(new SimpleResponse({
            speech: speechTxt,
            text: 'Welcome to Market Insights.',
        }));

        response.push(new BasicCard({
            text: CARD.body,
            title: CARD.title,
            subtitle: 'This is a subtitle',
            buttons: new Button({
            title: CARD.button.text,
            url: 'https://assistant.google.com/'
            }),
            image: new Image({
            url: 'https://image.shutterstock.com/image-photo/financial-business-color-charts-450w-1039907653.jpg',
            alt: 'Image alternate text',
            width: '720',
            height: '480'
            }),
            display: 'CROPPED'
        }));
        return conv.ask(...response);
    },
// };

// //help for 
// module.exports = {
    // createAudioObj(conv, textObj) {
        
    //     var speechTxt = utils.addAudio("", lodash.sample(textObj.prompt), textObj.altText);
    //     speechTxt = utils.addSpeak(speechTxt);

    //     return conv.close(new SimpleResponse({
    //         speech: speechTxt,
    //         text: '',
    //     }));
    // },
// };

// module.exports = {
    playAudio(conv) {

        console.log("in play audio");
        // var speechTxt = utils.addAudio("", notes.stories.audio, notes.intro.altText);
        // speechTxt = utils.addSpeak(speechTxt);

        var speechTxt = 'Notes';
        speechTxt = utils.addSpeak(speechTxt);

        conv.ask(new SimpleResponse({
            speech: speechTxt,
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
        var speechTxt = utils.addAudio("", audioObj, audioTxt);
        speechTxt = utils.addSpeak(speechTxt);

        return conv.ask(new SimpleResponse({
            speech: speechTxt,
            text: "",
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

            //selected commentary
            var speechTxt = utils.addAudio("", selectedCommentary.audio, selectedCommentary.altText);
            speechTxt = utils.addAudio(speechTxt, lodash.sample(commentary.next.prompt), commentary.next.altText);
            speechTxt = utils.addSpeak(speechTxt);

            return conv.ask(new SimpleResponse({
                speech: speechTxt,
                text: "",
            }));
        } else {
            console.log('in else from commentary, going to enter help');
            this.getHelpIntent(conv);
        }
        
    }, 

    getHelpIntent(conv) {

        console.log("from gethelp intent");
        if(conv.user.storage.convstate.toString().trim() == 'notes') {

            console.log('inside if help');
            // conv.user.storage.generalError = 0;
            var speechTxt = utils.addAudio("", lodash.sample(notes.help.prompt), notes.help.altText);
            speechTxt = utils.addSpeak(speechTxt);
    
            //check difference between ._sample and play for jovo framework
            return conv.ask(new SimpleResponse({
                speech:speechTxt,
                text: '',
            }));
        } else if (conv.user.storage.convstate.toString().trim() == 'commentary') {
            console.log('inside else if  help');
            
            //set this to zero
            conv.user.storage.commentaryError = 0;

            var speechTxt = utils.addAudio("", lodash.sample(commentary.help.prompt), commentary.help.altText);
            speechTxt = utils.addSpeak(speechTxt);
    
            //check difference between ._sample and play for jovo framework
            return conv.ask(new SimpleResponse({
                speech:speechTxt,
                text: '',
            }));
    
        } else {
            console.log('inside else help');
            conv.user.storage.generalError = 0
            
            var speechTxt = utils.addAudio("", lodash.sample(help.prompt), help.altText);
            speechTxt = utils.addSpeak(speechTxt);
    
            return conv.ask(new SimpleResponse({
                speech:speechTxt,
                text: '',
            }));
        }
    },

    getFallbackIntent(conv) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;
        console.log('in Default Fallback Intent intent');

        if(conv.user.storage.convstate.toString().trim() == 'notes') {

            conv.user.storage.generalError = 0;
            this.getHelpIntent(conv);
            
        } else if(conv.user.storage.convstate.toString().trim() == 'commentary') {

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
            this.getHelpIntent(conv);
        }
    }
};

