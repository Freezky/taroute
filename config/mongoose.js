/**
 * Created by kevynbele-binda on 2017-03-11.
 */

var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db);

    require('../app/models/user.server.model');
    require('../app/models/itineraries.server.model');
    return db;
};