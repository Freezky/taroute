var request = require('superagent');


exports.getItineraries = function(req, res, next){
	var payload = req.body;
	var checks = {
		bike: false,
		bus: false,
		walk: false,
	};
	var cb = function(step){
		checks.step = true;
	};
	payload.options.bike && getBikesItineraries(cb);
	payload.options.bus && getBusItineraries(cb);
	request
		.get('')
		.query({})
		.end(function(err, res){

		})
}

FB_APP_ID = '733631093482865';
FB_SECRET_KEY = '5308158e6801d905148b87c25206da20';
