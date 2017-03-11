/**
 * Created by kevynbele-binda on 2017-03-11.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//Example of mongoose schema structure
/*
var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    website: {
        type: String,
        get: function(url) {
            if (!url) {
                return url;
            } else {
                if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
                    url = 'http://' + url;
                }
                return url;
            }
        }
    },
    username: {
        type: String,
        trim: true,
        unique: true
    },
    password: String,
    created: {
        type: Date,
        default: Date.now
    }
});*/
