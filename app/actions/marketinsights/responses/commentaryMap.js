const commentariesById = {
	1: {
        audio: "https://am.jpmorgan.com/blob-gim/1383571455118/83456/clip1_slide19.mp3",
		altText: "Playing Commentary One.",
		image: "https://am.jpmorgan.com/blob-gim/1383571221132/83456/clip1_slide19_img.jpg"
    },
	2: {
        audio: "https://am.jpmorgan.com/blob-gim/1383571455277/83456/clip2_slide24.mp3",
		altText: "Playing Commentary Two.",
		image: "https://am.jpmorgan.com/blob-gim/1383571222947/83456/clip2_slide24_img.jpg"
    },
	3: {
        audio: "https://am.jpmorgan.com/blob-gim/1383571455436/83456/clip3_slide8.mp3",
		altText: "Playing Commentary Three.",
		image: "https://am.jpmorgan.com/blob-gim/1383571223259/83456/clip3_slide8_img.jpg"
    },
	4: {
        audio: "https://am.jpmorgan.com/blob-gim/1383571455595/83456/clip4_slide27.mp3",
		altText: "Playing Commentary Four.",
		image: "https://am.jpmorgan.com/blob-gim/1383571223445/83456/clip4_slide27_img.jpg"
    },
	5: {
        audio: "https://am.jpmorgan.com/blob-gim/1383571455807/83456/clip5_slide47.mp3",
		altText: "Playing Commentary Five.",
		image: "https://am.jpmorgan.com/blob-gim/1383571224384/83456/clip5_slide47_img.jpg"
    },
	6: {
		audio: "https://am.jpmorgan.com/blob-gim/1383571455974/83456/clip6_slide31.mp3",
		altText: "Playing Commentary Six.",
		image: "https://am.jpmorgan.com/blob-gim/1383571224507/83456/clip6_slide31_img.jpg"
	},
	7: {
		audio: "https://am.jpmorgan.com/blob-gim/1383571456134/83456/clip7_slide32.mp3",
		altText: "Playing Commentary Seven.",
		image: "https://am.jpmorgan.com/blob-gim/1383571226392/83456/clip7_slide32_img.jpg"
	},
	8: {
		audio: "https://am.jpmorgan.com/blob-gim/1383571456293/83456/clip8_slide5.mp3",
		altText: "Playing Commentary Eight.",
		image: "https://am.jpmorgan.com/blob-gim/1383571226513/83456/clip8_slide5_img.jpg"
	},
	9: {
		audio: "https://am.jpmorgan.com/blob-gim/1383571456493/83456/clip9_slide44.mp3",
		altText: "Playing Commentary Nine.",
		image: "https://am.jpmorgan.com/blob-gim/1383571226637/83456/clip9_slide44_img.jpg"
	},
	10: {
		audio: "https://am.jpmorgan.com/blob-gim/1383571456686/83456/clip10_slide60.mp3",
		altText: "Playing Commentary Ten.",
		image: "https://am.jpmorgan.com/blob-gim/1383571227031/83456/clip10_slide60_img.jpg"
	}
};

const allCommentaryIds = Object.keys(commentariesById);

module.exports = {
	commentariesById,
	allCommentaryIds
};
