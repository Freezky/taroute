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
	while (!this.isDone){}
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({routes: this.routes, message: this.error || ''}));
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
				mode: 'fastest;bicycle',
				departure: 'now',
				avoidAreas: boxArrayToString(unsafeAreas),
				combineChange: 'true',
				representation: 'display',
				routeAttributes: 'waypoints,summary,shape'
		})
		.end(function(err, res){
			if (!res.body || !res.body.response){ 
				_self.routes = []; _self.error = 'Notre service a rencontré une erreur.';
				console.log(res.body, err);
				return
			}	
			console.log(res.body.response.route[0], res.body.response.route[0].shape); 
			_self.routes = res.body.response.route;
			_self.isDone = true;
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
	console.log('avoidAreas -> ' + boxesString);
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
