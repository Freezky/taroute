/**
 * Created by kevynbele-binda on 2017-03-11.
 */

exports.render = function(req, res) {
    if (req.session.lastVisit) {
        console.log(req.session.lastVisit);
    }
    req.session.lastVisit = new Date();

    res.render('index', {
        title: 'Ta Route'
    })
};