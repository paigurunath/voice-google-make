module.exports = {
    intro: {
        prompt: "${audioURL}/4.0.library.yes.1.mp3"
    },
    episodes: {
        prompt: "<p>Coming right up. We have</p>",
        reprompt: "<p>Tell me the episode number you would like to hear</p>",
        repromptMore: "<p>or say more.</p>"
    },
    moreEpisodes: {
        prompt: "<p>Here are more episodes</p>",
        reprompt: "<p>Tell me the episode number you would like to hear</p>",
        repromptMore: "<p>You can also say more or library to go back to the main menu. What will it be?</p>"
    },
    description: {
        prompt: "${audioURL}/4.0.library.desc.1.mp3"
    },
    unhandled: {
        prompt: [
            "${audioURL}/5.0-no.content.prompt.1.mp3",
            "${audioURL}/5.0-no.content.prompt.2.mp3"
        ]
    },
    nocontent: {
        prompt: [
            "${audioURL}/5.0-no.content.1.mp3",
            "${audioURL}/5.0-no.content.2.mp3"
        ]
    }
}
