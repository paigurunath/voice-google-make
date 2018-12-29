const {
    dialogflow,
    BasicCard,
    Image,
    Button,
    SimpleResponse,
    MediaObject,
    Suggestions
} = require('actions-on-google');

const audioPlayer = require("./responses/audioPlayer");
const errors = require("./responses/errors");
const library = require("./responses/library");
const main = require("./responses/main");
const notifications = require("./responses/notifications");

const feedUrl = 'https://am.jpmorgan.com/us/en/asset-management/gim/adv/alexarss/voice-insights/My-Next-Move';
const AudioFeed = require('./libs/audio-feed-api');
const audioFeed = new AudioFeed(feedUrl);

var Speech = require('ssml-builder');
const lodash = require('lodash');

module.exports = {
    end(conv){
        console.log('end function');
        this.sessionEndedRequest(conv);
    },
    sessionEndedRequest(conv) {
        console.log('SessionEndedRequest');
        var speech = new Speech();
        speech.audio(lodash.sample(main.goodbye.prompt))

        //make it ssml
        var speechOutput = speech.ssml(true);

        return conv.close(new SimpleResponse({
            speech: speechOutput,
            text: 'Welcome',
        }));
    },

    newWelcomeIntent(conv) {
        console.log('new welcome intent');
        var speech = new Speech();
        speech.audio(lodash.sample(main.welcome.new))
        //make it ssml
        var speechOutput = speech.ssml();

        // //reprompts
        // var repromptSpeech = new Speech();
        // repromptSpeech.audio(lodash.sample(main.welcome.reprompt))
        // //make it ssml
        // var repromptSpeechOutput = repromptSpeech.ssml(true);

        // //reprompts
        // var repromptSpeech1 = new Speech();
        // repromptSpeech1.audio(lodash.sample(main.welcome.reprompt))
        // //make it ssml
        // var repromptSpeechOutput1 = repromptSpeech1.ssml(true);

        // //static reprompts 
        // conv.noInputs = [
        //     new SimpleResponse({
        //         text: repromptSpeechOutput,
        //         speech: '<speak>Talk to you later. Bye!</speak>'
        //     }),
        //     new SimpleResponse({
        //         text: repromptSpeechOutput1,
        //         speech: '<speak>Talk to you later. Bye!</speak>'
        //     }),
        //     new SimpleResponse({
        //         text: 'Talk to you later. Bye!',
        //         speech: '<speak>Talk to you later. Bye!</speak>'
        //     })
        // ]

        return conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: "Welcome",
        }));
    },

    welcomeIntent(conv) {
        console.log('welcome intent');

        var speech = new Speech();
        speech.audio(lodash.sample(main.welcome.returning))
        //make it ssml
        var speechOutput = speech.ssml(true);

        //reprompts
        var repromptSpeech = new Speech();
        repromptSpeech.audio(lodash.sample(main.welcome.reprompt))
        //make it ssml
        var repromptSpeechOutput = repromptSpeech.ssml(true);

        //reprompts
        var repromptSpeech1 = new Speech();
        repromptSpeech1.audio(lodash.sample(main.welcome.reprompt))
        //make it ssml
        var repromptSpeechOutput1 = repromptSpeech1.ssml(true);

        //static reprompts 
        conv.noInputs = [
            new SimpleResponse({
                text: repromptSpeechOutput,
                speech: '<speak>Talk to you later. Bye!</speak>'
            }),
            new SimpleResponse({
                text: repromptSpeechOutput1,
                speech: '<speak>Talk to you later. Bye!</speak>'
            }),
            new SimpleResponse({
                text: 'Talk to you later. Bye!',
                speech: '<speak>Talk to you later. Bye!</speak>'
            })
        ]

        return conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: "",
        }));
    },

    noIntent(conv) {
        console.log('no intent');
        this.end(conv);
    },

    yesIntent(conv) {
        console.log('yes intent');
        return this.latestIntent(conv);
    },

    async latestIntent(conv) {

        // async
        console.log('in latest from yes');
        // await
        const feed =  await audioFeed.getJSONFeed(feedUrl);
        const latest = feed.getLatest();

        console.log('latest ===>', latest);

        // const speech = this.speechBuilder()
        //     .addAudio(yes.prompt, "$");

        // let audioData = {
        //     audio: latest.audioURL,
        //     speech: speech,
        //     title: "My Next Move",
        //     subTitle: "Michael's Thoughts",
        //     text: latest.title
        // }

        // this.toIntent('PlayAudio', audioData);
        
        // this.playAudio(conv, latest)

        // return new Promise(function( resolve, reject) {

            

             
            var speech = new Speech();
            speech.audio(lodash.sample(audioPlayer.yes.prompt))
            //make it ssml
            var speechOutput = speech.ssml();
            
            // if (err) {
            //     console.log(err)
            //     reject( err );
            //   } else {

                    conv.ask(new SimpleResponse({
                        speech: speechOutput,
                        text: 'latest',
                    }));
            
                    conv.ask(new MediaObject({
                        name: latest.title,
                        url: latest.audioURL,
                        description: latest.description,
                        icon: new Image({
                            url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
                            alt: 'Media icon',
                        }),
                    }));
            
                    console.log('before returning!!!!!!!!!!!!!!!!!!!!!!!!!');
                    return conv.ask(new Suggestions("Episode"));
            // };
            // resolve();
        // })
    },

    playAudio(conv, episode) {

        console.log("in play audio");
      
        return new Promise(function() {
            var speech = new Speech();
            speech.audio(lodash.sample(audioPlayer.yes.prompt))
            //make it ssml
            var speechOutput = speech.ssml();
            
            conv.ask(new SimpleResponse({
                speech: speechOutput,
                text: '',
            }));
    
            conv.ask(new MediaObject({
                name: episode.title,
                url: episode.audioURL,
                description: episode.description,
                icon: new Image({
                    url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
                    alt: 'Media icon',
                }),
            }));
    
            console.log('before returning!!!!!!!!!!!!!!!!!!!!!!!!!');
            conv.ask(new Suggestions("Episode"));
        })
       
    },

    introIntent(conv) {
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
        console.log('episode only intent');
        this.episodeOnlyIntent(conv);
    },

    async episodeIntent(conv, params) {
        console.log('episode intent');

        let episodeNumber ='';
        
        episodeNumber = params.episodeNumber;
        //replace the url and check
        const feed = await audioFeed.getJSONFeed(process.env.AUDIO_API_URI);
        const episode = feed.getEpisode(episodeNumber);

        if(episode === '') {

            //send to unhandled or fallback
            this.toIntent('Unhandled');
        } else {

            // call the mediaresponse object
            this.playAudio(conv, episode);
        }

    }, 
    
    playAudio2(conv, episode) {

        console.log("in play audio");
      
        var speech = new Speech();
        speech.audio(lodash.sample(audioPlayer.yes.prompt))
        //make it ssml
        var speechOutput = speech.ssml(true);
        
        conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: '',
        }));

        conv.ask(new MediaObject({
            name: episode.title,
            url: episode.audioURL,
            description: episode.description,
            icon: new Image({
                url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
                alt: 'Media icon',
            }),
        }));

        return conv.ask(new Suggestions("Episode"));
    },

    subjectOnlyIntent(conv) {
        console.log('subject only intent');
        this.episodeOnlyIntent(conv);
    },

    async subjectIntent(conv) {
        console.log('subject intent');

        let subject ='';
        
        subject = params.subject;
       
        if(subject === '') {

            //send to unhandled or fallback
            this.toIntent('Unhandled');
        } else {

            const feed = await audioFeed.getJSONFeed(process.env.AUDIO_API_URI);
            const subjects = feed.getSubjectList(subject);

            const titles = subjects.map(episode => {
                return `episode ${episode.episode_num}, ${episode.title}`
            })

            const data =  {
                titles: titles,
                prompt: episodes.prompt,
                reprompt: episodes.reprompt,
                repromptMore: episodes.repromptMore
            }

            this.promptEpisodes(conv, data);
        }
    },

    promptEpisodes(conv, data) {
        console.log('PromptEpisodes');
        const titles = data.titles;
        const subSet = titles.splice(0, 3);

        // this.setSessionAttributes({titles: titles});

        // const list = createOxfordCommaList(subSet);
        var speech = new Speech();
        speech.audio(data.prompt)
        //make it ssml
        var speechOutput = speech.ssml(true);

        //reprompts
        var repromptSpeech = new Speech();
        repromptSpeech.audio(data.reprompt)
        //make it ssml
        var repromptSpeechOutput = repromptSpeech.ssml(true);

        //reprompts
        var repromptSpeech1 = new Speech();
        repromptSpeech1.audio(data.repromptMore)
        //make it ssml
        var repromptSpeechOutput1 = repromptSpeech1.ssml(true);

        //static reprompts 
        conv.noInputs = [
            new SimpleResponse({
                text: repromptSpeechOutput,
                speech: '<speak>Talk to you later. Bye!</speak>'
            }),
            new SimpleResponse({
                text: repromptSpeechOutput1,
                speech: '<speak>Talk to you later. Bye!</speak>'
            }),
            new SimpleResponse({
                text: 'Talk to you later. Bye!',
                speech: '<speak>Talk to you later. Bye!</speak>'
            })
        ]

        return conv.ask(new SimpleResponse({
            speech: speechOutput,
            text: "",
        }));
    },

    descriptionIntent(conv) {
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
        console.log('more intent');

        //get titles from session
        const titles = ''

        if(!titles.length) {

            var speech = new Speech();
            speech.audio(lodash.sample(library.nocontent.prompt))
            //make it ssml
            var speechOutput = speech.ssml(true);

            //reprompts
            var repromptSpeech = new Speech();
            repromptSpeech.audio(lodash.sample(library.nocontent.prompt))
            //make it ssml
            var repromptSpeechOutput = repromptSpeech.ssml(true);

            //static reprompts 
            conv.noInputs = [
                new SimpleResponse({
                    text: repromptSpeechOutput,
                    speech: ''
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

