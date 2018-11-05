
//add audio
exports.addAudio = function(pretext, prompt, altText){
    var pretext = pretext.toString();
    var audioStr = `<audio src='${prompt.toString()}' >${altText.toString()}</audio>`;

    pretext = pretext + audioStr;

    return pretext;
}

//add a break
exports.addBreak = function(pretext, timeInMiliSeconds){
    //<break time="3s"/>
    var pretext = pretext.toString();
    var audioStr = `<break time='${timeInMiliSeconds.toString()}' />`;

    pretext = pretext + audioStr;

    return pretext;
}

//add speak
exports.addSpeak = function(pretext){
    return `<speak> ${pretext.toString()} </speak>`;
}