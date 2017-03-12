/**
 * Created by kevynbele-binda on 2017-03-11.
 */

module.exports = {
    db: 'mongodb://localhost/taRouteDev',
    sessionSecret: 'developmentSessionSecret',
    facebook: {
        clientID: '733631093482865',
        clientSecret: '5308158e6801d905148b87c25206da20',
        callbackURL: 'http://localhost:3000/oauth/facebook/callback',
        profileFields: ['id', 'emails', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    },
    google: {
        clientID: '529443776406-vj24g6st5lnqa8ir2doc9c7gf25s6kos.apps.googleusercontent.com',
        clientSecret: 'dUfSFSNPVEwizEYzj95jChCc',
        callbackURL: 'http://localhost:3000/oauth/google/callback'
    },
    calendar: {
        clientID: '529443776406-vj24g6st5lnqa8ir2doc9c7gf25s6kos.apps.googleusercontent.com',
        clientSecret: 'dUfSFSNPVEwizEYzj95jChCc',
        callbackURL: 'http://localhost:3000/oauth/google/calendar'
    }
};