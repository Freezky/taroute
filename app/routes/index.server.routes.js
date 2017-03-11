/**
 * Created by kevynbele-binda on 2017-03-11.
 */

module.exports = function(app) {
    var index = require('../controllers/index.server.controller');
    app.get('/', index.render);
};