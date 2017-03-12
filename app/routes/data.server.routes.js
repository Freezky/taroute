/**
 * Created by kevynbele-binda on 2017-03-11.
 */

module.exports = function (app) {
    app.route('/users/:userId')
        .get(users.read);
    app.param('userId', users.userByID);
}