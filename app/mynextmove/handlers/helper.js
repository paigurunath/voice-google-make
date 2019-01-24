const {
    Image,
    SimpleResponse,
    MediaObject,
    Suggestions
} = require('actions-on-google');
const Speech = require('ssml-builder');
const lodash = require('lodash');

const audioPlayer = require("../responses/audioPlayer");
const library = require("../responses/library");
const main = require("../responses/main");
const createOxfordCommaList = require('../../libs/utils').createOxfordCommaList;
const config = require('../../config/config.json');

const feedUrl = config.mynextmove.feedUrl;
const AudioFeed = require('../../libs/audio-feed-api');
const audioFeed = new AudioFeed(config.mynextmove.feedUrl);


module.exports = {
    end(conv){

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('end function');
        this.sessionEndedRequest(conv);
    },
    sessionEndedRequest(conv) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('SessionEndedRequest');
        var speech = new Speech();
        speech.audio(lodash.sample(main.goodbye.prompt))

        //make it ssml
        var speechOutput = speech.ssml();

        return conv.close(new SimpleResponse({
            speech: speechOutput,
            text: main.goodbye.text,
        }));
    },

    newWelcomeIntent(conv) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('new welcome intent');
        var speech = new Speech();
        speech.audio(lodash.sample(main.welcome.new))
        //make it ssml
        var speechOutput = speech.ssml();

        return conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: "Welcome",
        }));
    },

    welcomeIntent(conv) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('welcome intent');

        var speech = new Speech();
        speech.audio(lodash.sample(main.welcome.returning))
        //make it ssml
        var speechOutput = speech.ssml();

        return conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: 'Welcome',
        }));
    },

    noIntent(conv) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('no intent');
        this.end(conv);
    },

    yesIntent(conv) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('yes intent');
        return this.latestIntent(conv);
    },

    async latestIntent(conv) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;
        // async
        console.log('in latest from yes');
        // await
        const feed =  await audioFeed.getJSONFeed(feedUrl);
        const latest = feed.getLatest();

        console.log('latest ===>', latest);

        var speech = new Speech();
        speech.audio(lodash.sample(audioPlayer.yes.prompt))
        //make it ssml
        var speechOutput = speech.ssml();
        
        conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: 'latest',
        }));

        conv.ask(new MediaObject({
            name: latest.title,
            url: latest.audioURL,
            description: latest.description,
            icon: new Image({
                url: 'https://s3.amazonaws.com/alexa-chase-voice/MichaelLierschRecordings/image/512.png',
                alt: 'Media icon',
            }),
        }));

        return conv.ask(new Suggestions("Episode"));
    },

    // playAudio(conv, episode) {

    //     conv.data.previousIntent = conv.data.currentIntent;
    //     conv.data.currentIntent = conv.intent;

    //     console.log("in play audio");
      
    //     return new Promise(function() {
    //         var speech = new Speech();
    //         speech.audio(lodash.sample(audioPlayer.yes.prompt))
    //         //make it ssml
    //         var speechOutput = speech.ssml();
            
    //         conv.ask(new SimpleResponse({
    //             speech: speechOutput,
    //             text: '',
    //         }));
    
    //         conv.ask(new MediaObject({
    //             name: episode.title,
    //             url: episode.audioURL,
    //             description: episode.description,
    //             icon: new Image({
    //                 url: 'https://s3.amazonaws.com/alexa-chase-voice/myNextMove1400x1400px.png',
    //                 alt: 'Media icon',
    //             }),
    //         }));
    
    //         console.log('before returning!!!!!!!!!!!!!!!!!!!!!!!!!');
    //         conv.ask(new Suggestions("Episode"));
    //     })
       
    // },

    introIntent(conv) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('intro Intent');
        var speech = new Speech();
        speech.audio(library.intro.prompt)

        //make it ssml
        var speechOutput = speech.ssml(true);

        return conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: '',
        }));
    },

    episodeOnlyIntent(conv) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('episode only intent');
        this.episodeOnlyIntent(conv);
    },

    async episodeIntent(conv, params) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('episode intent');

        let episodeNumber ='';
        
        episodeNumber = params.episodeNumber;
        //replace the url and check
        const feed = await audioFeed.getJSONFeed(feedUrl);
        const episode = feed.getEpisode(episodeNumber);

        console.log("Episode selected : " + JSON.stringify(episode)); 
        if(episode === '') {

            //send to unhandled or fallback
            var speech = new Speech();
            speech.audio(lodash.sample(library.unhandled.prompt));
            //make it ssml
            var speechOutput = speech.ssml();

            conv.ask(new SimpleResponse({
                speech: speechOutput,
                text: "Fallback",
            }));
        } else {

            // call the mediaresponse object
            this.playAudio2(conv, episode);
        }

    }, 
    
    playAudio2(conv, episode) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log("in play audio");
      
        var speech = new Speech();
        speech.audio(lodash.sample(audioPlayer.yes.prompt))
        //make it ssml
        var speechOutput = speech.ssml(true);
        
        conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: 'episode',
        }));

        conv.ask(new MediaObject({
            name: episode.title,
            url: episode.audioURL,
            description: episode.description,
            icon: new Image({
                url: 'https://s3.amazonaws.com/alexa-chase-voice/myNextMove1400x1400px.png',
                alt: 'Media icon',
            }),
        }));

        return conv.ask(new Suggestions("Episode"));
    },

    subjectOnlyIntent(conv) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('subject only intent');
        this.subjectIntent(conv);
    },

    async subjectIntent(conv, params) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('subject intent');

        let subject ='';
        
        subject = params.subject;
       
        const feed = await audioFeed.getJSONFeed(feedUrl);
        const subjects = feed.getSubjectList(subject);

        const titles = subjects.map(episode => {
            return `episode ${episode.episode_num}, ${episode.title}`
        });

        if(subject === '') {

            //send to unhandled or fallback
            var speech = new Speech();
            speech.audio(lodash.sample(library.unhandled.prompt));
            //make it ssml
            var speechOutput = speech.ssml();

            conv.ask(new SimpleResponse({
                speech: speechOutput,
                text: "Fallback",
            }));
        } else {
            const data =  {
                titles: titles,
                prompt: library.episodes.prompt,
                reprompt: library.episodes.reprompt,
                repromptMore: library.episodes.repromptMore
            }

            this.promptEpisodes(conv, data);
        }
    },

    promptEpisodes(conv, data) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('in PromptEpisodes');
        const titles = data.titles;
        const subSet = titles.splice(0, 3);

        // this.setSessionAttributes({titles: titles});

        const list = createOxfordCommaList(subSet);
        console.log('list : ' + JSON.stringify(list));
        // console.log('data.prompt : ' + JSON.stringify(data.prompt));
        //add speech
        var speech = new Speech();
        speech.paragraph(data.prompt)
        speech.paragraph(list)
        speech.paragraph(data.reprompt)
        speech.paragraph(data.repromptMore)
        //add reprompt
        var repromptSpeech = new Speech();
        repromptSpeech.paragraph(data.reprompt);
        repromptSpeech.paragraph(data.repromptMore);
        // console.log('titles.length', titles.length);
        // console.log('data : ' + JSON.stringify(data));

        var speechOutput = speech.ssml();
        var repromptSpeechOutput = repromptSpeech.ssml();
        // var speechOutput = speech.toObject();
        console.log('********************************************');
        console.log(speechOutput);
        console.log('********************************************');
        // console.log(repromptSpeechOutput);
        console.log('********************************************');
       
        return conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: "Subject",
        }));
    },

    descriptionIntent(conv) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('description Intent');

        var speech = new Speech();
        speech.audio(library.description.prompt)
        //make it ssml
        var speechOutput = speech.ssml(true);

        //reprompts
        var repromptSpeech = new Speech();
        repromptSpeech.audio(library.description.prompt)
        //make it ssml
        var repromptSpeechOutput = repromptSpeech.ssml(true);

        //static reprompts 
        conv.noInputs = [
            new SimpleResponse({
                text: repromptSpeechOutput,
                speech: '<speak>Talk to you later. Bye!</speak>'
            }),
         
            new SimpleResponse({
                text: speechOutput,
                speech: ''
            })
        ]

        return conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: "",
        }));
    },

    moreIntent(conv) {

        conv.data.previousIntent = conv.data.currentIntent;
        conv.data.currentIntent = conv.intent;

        console.log('more intent');

        // get the titles from the session
        // const titles = this.getSessionAttribute('titles');

        //get titles from session
        const titles = ''

        if(!titles.length) {

            var speech = new Speech();
            speech.audio(lodash.sample(library.nocontent.prompt))
            //make it ssml
            var speechOutput = speech.ssml();

            //reprompts
            var repromptSpeech = new Speech();
            repromptSpeech.audio(lodash.sample(library.nocontent.prompt))
            //make it ssml
            var repromptSpeechOutput = repromptSpeech.ssml(true);

            return conv.ask(new SimpleResponse({
                speech: speechOutput,
                text: "More",
            }));
            // //static reprompts 
            // conv.noInputs = [
            //     new SimpleResponse({
            //         text: repromptSpeechOutput,
            //         speech: ''
            //     }),
            
            //     new SimpleResponse({
            //         text: speechOutput,
            //         speech: ''
            //     })
            // ]

            // return conv.ask(new SimpleResponse({
            //     speech: speechOutput,
            //     text: "",
            // }));

        } else {

            const data =  {
                titles: titles,
                prompt: library.moreEpisodes.prompt,
                reprompt: library.moreEpisodes.reprompt,
                repromptMore: library.moreEpisodes.repromptMore
            }

            this.promptEpisodes(conv, data);
        }
    },

    

};

