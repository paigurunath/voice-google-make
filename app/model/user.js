module.exports = function (sequelize, Sequelize) {

    var user = sequelize.define('user', {
        user_id: {
            type: Sequelize.TEXT
        },
        visit: {
            type: Sequelize.INTEGER
        }
    });
    return user;
}