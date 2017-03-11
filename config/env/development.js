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
    }
};