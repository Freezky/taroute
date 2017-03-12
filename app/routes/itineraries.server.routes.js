var itineraries = require('../controllers/itineraries.server.controller');
var index = require('../controllers/index.server.controller');
module.exports = function (app) {
	app.route('/directions')
	   .post(itineraries.getItineraries)
	   .get(index.render)
};