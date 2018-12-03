const fs        = require('fs'),
      Promise   = require('bluebird'),
      path      = require('path'),
      _         = require('lodash'),
      { compileTemplate } = require('../libs/utils'),
      responses = {};

const dirs      = fs.readdirSync(__dirname);
const pattern = new RegExp(/[\w-]*\.js(on)?/);

let filtered  = _.filter(dirs, fileName => pattern.test(fileName));

filtered.forEach(file => {
    const fileName = _.camelCase(file.replace(/\.js(on)?/, ''));
    if(fileName === 'index') return;
    responses[fileName] = require(`./${file}`);
});

function replaceAudioURL(obj, audioURL) {
    _.forEach(obj, (item, key) => {
        if(typeof item === 'string') {
            obj[key] = compileTemplate(item, {audioURL: audioURL});
        } else {
            replaceAudioURL(item, audioURL);
        }
    })
}

replaceAudioURL(responses, process.env.AUDIO_URL);

module.exports = responses;
