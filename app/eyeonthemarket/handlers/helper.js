const {
    dialogflow,
    BasicCard,
    Image,
    Button,
    SimpleResponse,
    MediaObject,
    Suggestions
} = require('actions-on-google');


const AudioFeed = require('../libs/audio-feed-api');
const feedUrl = 'https://am.jpmorgan.com/us/en/asset-management/gim/adv/alexarss/voice-insights/Eye-on-the-Market';
const audioFeed = new AudioFeed(feedUrl);
const welcome = require('../responses/welcome');

var Speech = require('ssml-builder');
const lodash = require('lodash');

module.exports = {
    async latestIntent(conv ) {

        // async
        console.log('getting feed for eye on the market');
        const feed =  await audioFeed.getJSONFeed(feedUrl);
        const sortedData = feed.getSortedAudioUrl();
        const audioURLFeed = sortedData[sortedData.length - 1].audioURL

        console.log('latest ===>', audioURLFeed);

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
          
    }
};

