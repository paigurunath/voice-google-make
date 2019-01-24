'use strict';

const expect    = require('chai').expect;
const _         = require('lodash');
const util      = require('util');
const AudioFeed = require('../audio-feed-api');
const audioFeed = new AudioFeed();
const jsonFeed = process.env.AUDIO_API_URI;

describe('Audio Feed API', () => {
    describe('#getAudioFeed()', () => {
        it("Get xml audio feed", (done) => {
            audioFeed.getXMLFeed(xmlURI)
                .then(results => {
                    console.log('results', util.inspect(results, { colors: true, depth: 3 }));
                    done();
                })
                .catch(err => {
                    console.log('err', err);
                    done();
                });
        });
    });

    describe('#getAudioFeed()', () => {
        it("Get json audio feed", (done) => {
            audioFeed.getJSONFeed(jsonFeed)
                .then(results => {
                    console.log('results', util.inspect(results, { colors: true, depth: 3 }));
                    done();
                })
                .catch(err => {
                    console.log('err', err);
                    done();
                });
        });
    });

    describe('#getSubject()', () => {
        it("Get subject", () => {
            const subject = audioFeed.getSubjectList('spend');
            console.log(util.inspect(subject, { colors: true, depth: 3 }));
        });
    });

    describe('#getEpisode()', () => {
        it.only("Get episode", () => {
            audioFeed.getJSONFeed(jsonFeed)
                .then(results => {
                    const episode = audioFeed.getEpisode(4);
                    console.log(util.inspect(episode, { colors: true, depth: 3 }));
                })
        });
    });
});
