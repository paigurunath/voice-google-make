module.exports = {
	intro: {
		prompt: [
			"https://am.jpmorgan.com/blob-gim/1383571192962/83456/3.0_commentary_explanation_1.mp3",
			"https://am.jpmorgan.com/blob-gim/1383571193121/83456/3.0_commentary_explanation_2.mp3"
		],
		altText: "Let's dig a little deeper. Tell me what number clip you want to hear.",
		image: "https://am.jpmorgan.com/blob-gim/1383571464125/83456/general.jpg"
	},
    next: {
		prompt: [
			"https://am.jpmorgan.com/blob-gim/1383571193280/83456/3.0_next_clip_1.mp3",
			"https://am.jpmorgan.com/blob-gim/1383571193439/83456/3.0_next_clip_2.mp3"
		],
		altText: "Say Next to move to the next commentary.",
	},
	last: {
		prompt: [
			"https://am.jpmorgan.com/blob-gim/1383571198846/83456/9.0_nomorecontent_rep_1.mp3",
			"https://am.jpmorgan.com/blob-gim/1383571199005/83456/9.0_nomorecontent_rep_2.mp3"
		],
		altText: "You've reached the end of the commentary for this Guide to the Markets.",
	},
	invalid: {
		first: [
			"https://am.jpmorgan.com/blob-gim/1383571195029/83456/5.0_firsterror_generalcatch_1.mp3",
			"https://am.jpmorgan.com/blob-gim/1383571195188/83456/5.0_firsterror_generalcatch_2.mp3"
		],
		second: [
			"https://am.jpmorgan.com/blob-gim/1383571195347/83456/5.0_seconderror_generalcatch_1.mp3",
			"https://am.jpmorgan.com/blob-gim/1383571195506/83456/5.0_seconderror_generalcatch_2.mp3"
		],
		altText: "I didn't understand. Please say clip and then the number."
	},
	stop: {
		prompt: [
			"https://am.jpmorgan.com/blob-gim/1383571193598/83456/3.0_stop_clip_1.mp3",
			"https://am.jpmorgan.com/blob-gim/1383571193757/83456/3.0_stop_clip_2.mp3"
		],
		altText: "Hope that was helpful."
	},
	help: {
		prompt: [
			"https://am.jpmorgan.com/blob-gim/1383571193916/83456/4.0_help_commentary_1.mp3",
			"https://am.jpmorgan.com/blob-gim/1383571194075/83456/4.0_help_commentary_2.mp3"
		],
		altText: "I'm here to help. Say Play clip, and then the number."
	}
};
