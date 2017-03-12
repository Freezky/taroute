/**
 * Created by kevynbele-binda on 2017-03-11.
 */

var passport = require('passport'),
    url = require('url'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    config = require('../config'),
    google = require('googleapis'),
    googleAuth = require('google-auth-library'),
    auth = new googleAuth(),
    oauth2Client = new auth.OAuth2(config.calendar.clientID, config.calendar.clientID, config.calendar.callbackURL);

module.exports = function() {
    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            var providerData = profile._json;
            providerData.accessToken = accessToken;
            providerData.refreshToken = refreshToken;
            listEvents(oauth2Client);
            module.exports = function listEvents(auth) {
                var calendar = google.calendar('v3');
                calendar.events.list({
                    auth: auth,
                    calendarId: 'primary',
                    timeMin: (new Date()).toISOString(),
                    maxResults: 10,
                    singleEvents: true,
                    orderBy: 'startTime'
                }, function (err, response) {
                    if (err) {
                        console.log('The API returned an error: ' + err);
                        return;
                    }
                    var events = response.items;
                    if (events.length == 0) {
                        console.log('No upcoming events found.');
                    } else {
                        console.log('Upcoming 10 events:');
                        for (var i = 0; i < events.length; i++) {
                            var event = events[i];
                            var start = event.start.dateTime || event.start.date;
                            console.log('%s - %s', start, event.summary);
                        }
                    }
                });
            }
        }));
}