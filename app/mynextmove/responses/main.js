module.exports = {
    welcome: {
        new: ['${audioURL}/0.0-welcome.ftu.1.mp3', '${audioURL}/0.0-welcome.ftu.2.mp3'],
        returning: ['${audioURL}/0.0-welcome.ru.1.mp3', '${audioURL}/0.0-welcome.ru.2.mp3'],
        reprompt: ['${audioURL}/1.0-welcome.ru.library_latest.1.mp3', '${audioURL}/1.0-welcome.ru.library_latest.2.mp3']
    },
    goodbye: {
        prompt: ['${audioURL}/0.0-no.1.mp3', '${audioURL}/0.0-no.2.mp3'],
        text: 'Goodbye!'
    },
    bio: {
        prompt: '${audioURL}/5.0-bio.1.mp3'
    }
};
