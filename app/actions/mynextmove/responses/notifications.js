module.exports = {
    welcome: {
        newUser: [
            'https://am.jpmorgan.com/blob-gim/1383563673481/83456/1.0-welcome.ftu.1.mp3',
            'https://am.jpmorgan.com/blob-gim/1383563673648/83456/1.0-welcome.ftu.2.mp3'
        ],
        returning: [
            'https://am.jpmorgan.com/blob-gim/1383563673815/83456/2.0-welcome.notsub.1.mp3',
            'https://am.jpmorgan.com/blob-gim/1383563673982/83456/2.0-welcome.notsub.2.mp3'
        ],
        reprompt: [
            'https://am.jpmorgan.com/blob-gim/1383563671544/83456/0.0-reprompt.1.mp3',
            'https://am.jpmorgan.com/blob-gim/1383563671711/83456/0.0-reprompt.2.mp3',
            'https://am.jpmorgan.com/blob-gim/1383563671878/83456/0.0-reprompt.3.mp3'
        ]
    },
    yes: {
        alexa: {
            prompt: [
                "https://am.jpmorgan.com/blob-gim/1383563674167/83456/3.0-notifications.yes.alexa.1.mp3",
                "https://am.jpmorgan.com/blob-gim/1383563674467/83456/3.0-notifications.yes.alexa.2.mp3"
            ],
            promptText: "<p>Sure Michael.<break time=\"1s\" /> I got this. Just follow these steps</p><p>1, Go to your Alexa app on your phone.</p><p>2, Go to the Skills tab and look for My Next Move.</p><p>3, Enable Notifications</p><p>When Michael has a new episode, there will be a pulsating yellow light around your Echo device. Just ask me for your Notifications.</p><p>I'll also send these instructions to a card in your Alexa app.</p><p>Now let's get to the good stuff! You can hear our latest episode or choose from previous ones.</p><p>Just say Latest, or Library.</p>"
        },
        google: {
            prompt: [
                "https://am.jpmorgan.com/blob-gim/1383563674638/83456/3.0-notifications.yes.google.1.mp3",
                "https://am.jpmorgan.com/blob-gim/1383563674812/83456/3.0-notifications.yes.google.2.mp3"
            ]
        }
    },
    no: {
        prompt: [
            "https://am.jpmorgan.com/blob-gim/1383563672045/83456/1.0-welcome.ftu.no.notifications.1.mp3",
            "https://am.jpmorgan.com/blob-gim/1383563672045/83456/1.0-welcome.ftu.no.notifications.2.mp3"
        ]
    }
}
