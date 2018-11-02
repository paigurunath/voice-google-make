module.exports = function (sequelize, Sequelize) {

    var voicedata = sequelize.define('voicedata', {
        logdata:Sequelize.TEXT
    });
    return voicedata;
}

