var getSafeDirections = require('./controllers/itineraries.server.controller.js').getSafeDirections;

var payload = {
	// centre sportif uqam
	lat1: 45.512036,
	lng1: -73.559920,
	// western union
	lat2: 45.509841,
	lng2: -73.564072,
};

getSafeDirections(payload);
