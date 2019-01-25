module.exports = {
	newUser: {
		prompt: [
			"https://s3.amazonaws.com/alexa-eotm-skill/audio/1.0_welcome_ftu_01.mp3",
			"https://s3.amazonaws.com/alexa-eotm-skill/audio/1.0_welcome_ftu_02.mp3"
		],
		google: "https://s3.amazonaws.com/alexa-eotm-skill/audio/1.0_welcome_google_ru_01.mp3",
		altText: "Welcome to Eye on the market."
	},
	returningUser: {
		prompt: [
			"https://s3.amazonaws.com/alexa-eotm-skill/audio/2.0_welcome_ru_01.mp3",
			"https://s3.amazonaws.com/alexa-eotm-skill/audio/2.0_welcome_ru_02.mp3"
		],
		altText: "Welcome back to eye on the market."
	},
	subscribedUser: {
		prompt: [
			"https://s3.amazonaws.com/alexa-eotm-skill/audio/2.0_welcome_ru_alreadysubscribed_01.mp3",
			"https://s3.amazonaws.com/alexa-eotm-skill/audio/2.0_welcome_ru_alreadysubscribed_02.mp3"
		],
		altText: "Welcome back to eye on the market."
	},
	notifications: {
		prompt: 'Before michael gets to his latest thoughts, would you like to enable notifications so you never miss an episode?',
		no: 'Ok, no problem! You can always enable Notifications in the Settings tab of your Alexa app. Now on to the podcast',
		yes: {
			prompt: 'Good choice! here\'s how you do it. just follow these steps. 1. go to your alexa app on your phone. 2. go to the skills tab and look for eye on the market. 3. enable notifications. i\'ll also send an opt in card to your alexa app. when michael has a new episode, there will be a yellow flashing light around your alexa device. just ask me for your notifications. would you like to hear the latest podcast? ',
			yes: 'sure, coming right up! ',
			no: 'no problem. come back anytime '
		}
	}
};
