const {
    Image,
    SimpleResponse,
    MediaObject,
    Suggestions
} = require('actions-on-google');
const request = require('request-promise');
const Speech = require('ssml-builder');
const lodash = require('lodash');

const welcome = require('../responses/welcome');
const config = require('../../../config/config.json');
const AudioFeed = require('../../../libs/audio-feed-api');

const feedUrl = config.eyeonthemarket.feedUrl;
const audioFeed = new AudioFeed(config.eyeonthemarket.feedUrl);

module.exports = {
    async latestIntent(conv, visitVal ) {

        var speech = new Speech();
        console.log("visitVal : " + visitVal);
        if(visitVal < 2) {
            speech.audio(welcome.newUser.google);
        } else if(visitVal >= 2) {
            speech.audio(lodash.sample(welcome.subscribedUser.prompt));
        }

        var speechOutput = speech.ssml();

        // async
        console.log('getting feed for eye on the market');
        const feed =  await audioFeed.getJSONFeed(feedUrl);
        const sortedData = feed.getSortedAudioUrl();
        
        // console.log('Sorted data : ' + JSON.stringify(sortedData));
        // console.log('Sorted data length  : - : ' + JSON.stringify(sortedData.length));
        // console.log('Sorted data  : - : ' + JSON.stringify(sortedData[sortedData.length - 1]));
        
        const audioURLFeed = sortedData[0].audioURL

        console.log('latest ===>', audioURLFeed);

        //write the service to store podcast url to DB

        var dataObj = {};
        dataObj.userid = conv.user._id;
        dataObj.skillid = conv.user._id;
        dataObj.audiourl = audioURLFeed;
        dataObj.offsetmili = '';
    
        var options = {
            method: 'POST',
            uri: config.dbServiceBase + config.dbService.updateSkillAudio,
            body: dataObj,
            json: true // Automatically stringifies the body to JSON
        };
    
        var promiseObj = new Promise(function(resolve, reject) {
            request(options)
                .then(function (result) {
                    resolve();
                 })
                .catch(function (err) {
                    reject();
                });
        });
        
        return promiseObj.then(function() {
            
            console.log("3 welcome");
            conv.ask(new SimpleResponse({
                speech: speechOutput,
                text: 'Welcome',
            }));
    
            conv.ask(new MediaObject({
                name: 'Welcome',
                url: audioURLFeed,
                description: 'Welcome',
                icon: new Image({
                    url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
                    alt: 'Media icon',
                }),
            }));
    
            return conv.ask(new Suggestions("Welcome"));
        })
        .catch(function(err) {
            console.log('--------------------------------pause related---------------------------------');
            console.log(err)
            console.log("4 welcome");
            conv.ask(new SimpleResponse({
                speech: speechOutput,
                text: 'Welcome',
            }));
    
            conv.ask(new MediaObject({
                name: 'Welcome',
                url: audioURLFeed,
                description: 'Welcome',
                icon: new Image({
                    url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
                    alt: 'Media icon',
                }),
            }));
    
            return conv.ask(new Suggestions("Welcome"));
        });


        
          
    }
};

