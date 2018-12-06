module.exports = {
    unhandled: {
        prompt: ['https://am.jpmorgan.com/blob-gim/1383563678208/83456/5.0-repeat.1.mp3', 'https://am.jpmorgan.com/blob-gim/1383563678375/83456/5.0-repeat.2.mp3'],
        promptText: 'I didn\'t catch that, would you mind repeating it?',
        reprompt: 'https://am.jpmorgan.com/blob-gim/1383563676204/83456/5.0-help.1.precrawl.mp3',
        repromptText: `Say latest to hear Michael\'s latest thoughts.`
    },
    unhandledAudio: {
        prompt: ['https://am.jpmorgan.com/blob-gim/1383563677039/83456/5.0-no.content.1.mp3', 'https://am.jpmorgan.com/blob-gim/1383563677206/83456/5.0-no.content.2.mp3'],
        promptText: 'I am sorry, but I can\'t find that. Please say latest to listen to the latest podcast.',
        deviceError: 'Your device is not capable of playing this audio file. Please contact your JP Morgan representative for more information'
    },
    help: {
        prompt: ['https://am.jpmorgan.com/blob-gim/1383563676037/83456/5.0-help.1.crawl.mp3', 'https://am.jpmorgan.com/blob-gim/1383563676371/83456/5.0-help.2.crawl.mp3'],
        text: 'Say "latest" to hear Michael\'s latest thoughts or library to hear previous episodes.'
    }
};
