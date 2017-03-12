var itineraries = require('../controllers/itineraries¸.server.controller');

module.exports = function (app) {
	app.route('/directions')
	   .post(itineraries¸getItineraries);
};