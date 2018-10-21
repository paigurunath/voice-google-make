module.exports = {
	prompt: "https://am.jpmorgan.com/blob-gim/1383571200620/83456/Disclosure.mp3",
	altText: "Disclosure",
	card: {
		title: "Disclosure",
		body: "This content has been produced for informational purposes only, and as such, the views contained herein are not to be taken as an advice or a recommendation to buy or sell any investment or interest thereto. Reliance upon information in this material is at the sole discretion of the recipient.\nThe material was prepared without regard to specific objectives, financial situation, or needs of any particular receiver. Any research in this asset has been obtained, and may have been acted upon, by J.P. Morgan Asset Management for its own purpose. The results of such research are being made available as additional information, and do not necessarily reflect the views of J.P. Morgan Asset Management.\nAny forecasts, figures, opinions, statements of financial market trends or investments techniques and strategies expressed, are those of J.P. Morgan Asset Management, unless otherwise stated, as of the day of production. They are considered to be reliable sat that time, but no warranty as to the accuracy, and reliability or completeness, in respect to any error or omission is accepted. They may be subject to change without reference or notification to you.\nJ.P. Morgan Asset Management is the brand name of the asset management business of JP Morgan Chase and Company and its affiliates worldwide. JP Morgan Distribution Services, Inc.\nCopyright 2018. JPMorgan Chase & Co.",
		image: {
			smallImageUrl: `${process.env.ASSETS_URI}/image/alexa_card_logo_small.png`,
			largeImageUrl: `${process.env.ASSETS_URI}/image/alexa_card_logo_large.png`
		},
		button: {
			text: "Read More",
			link: "https://www.jpmorgan.com/country/US/EN/disclosures/jpmorganmarkets"
		}
	}
};
