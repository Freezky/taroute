var request = require('superagent');
var geoutils = require('../utils.js');

APP_ID = 'JU13C2QwBtMUR7NVqlOi';
APP_CODE = 'FHfevJrLfCmT5nMD2Vchfw';
BASE_URL = 'https://route.cit.api.here.com/routing/7.2/calculateroute.json';

exports.getItineraries = function(req, res, next){
	this.isDone = true;
	var payload = req.body;
	payload.options.bike;
	this.getSafeDirections = getSafeDirections.bind(this);
	this.getSafeDirections();
	request
		.get('')
		.query({})
		.end(function(err, res){

		})
};

function getSafeDirections(payload){
	// var unSafeAreas = getfromdb;
	var unsafeAreas = [{latMax: 45.511376, lngMin: -73.562815, latMin: 45.510955, lngMax: -73.562638}];

	var _self = this;
	request
		.get(BASE_URL)
		.query({app_id: APP_ID, app_code: APP_CODE, 
				waypoint0: 'geo!'+payload.lat1+','+payload.lng1, 
				waypoint1: 'geo!'+payload.lat2+','+payload.lng2, 
				mode: 'fastest;car',
				departure: 'now',
				avoidAreas: boxArrayToString(unsafeAreas),
				combineChange: 'true',
				representation: 'display',
		})
		.end(function(err, res){
			_self.routes = res.body.response.route;
			console.log(res.body, res.body.response.route[0], res.body.response.route[0].shape); 
		});
}

function boxArrayToString(boundingBoxes){
	var boxesString = '';
	boundingBoxes.map(function(box, i){
		if (box){
			boxesString += box.latMax+','+box.lngMin+';'+box.latMin+','+box.lngMax;
			if (i < boundingBoxes.length - 1){
				boxesString += '!';
			}
		}
	});
	console.log('avoidAreas -> '+boxesString,);
	return boxesString;
}

// function getDirectionsWithBike(payload){
// 	var bounding = geoutils.getBoundingBox(payload);
// 	queryBixieStations : bounding -> bixiStations;
// 	bixiStations -> only those closeToCyclableRoad(80 meters bounding box);
// 	each bixiStation ->  cyclable road where most extreme (closest to destination) point is closer to destination than the bixiStation;
// 						 compare these itineraries for e: bus - bixi in - bixi out - bus (or destination) - destination;
// 	take the best itinerary;
// 	respond with duration;
// }

exports.getSafeDirections = getSafeDirections;
