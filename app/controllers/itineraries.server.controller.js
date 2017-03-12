var request = require('superagent');
var geoutils = require('../utils.js');
var DataSchema = require('../models/itineraries.server.model.js').DataSchema;
var Accident = require('mongoose').model('Accident', DataSchema);

APP_ID = 'JU13C2QwBtMUR7NVqlOi';
APP_CODE = 'FHfevJrLfCmT5nMD2Vchfw';
BASE_URL = 'https://route.cit.api.here.com/routing/7.2/calculateroute.json';

exports.getItineraries = function(req, res, next){
	this.isDone = true;
	var payload = req.body;
	//ayload.options.bike;
	this.getSafeDirections = getSafeDirections.bind(this);
	this.getSafeDirections(payload, res);

};

function getSafeDirections(payload, resp){
	// var unSafeAreas = getfromdb;
	var unsafeAreas = [{latMax: 45.511376, lngMin: -73.562815, latMin: 45.510955, lngMax: -73.562638}];
	var boundingBox = geoutils.getBoundingBox(payload.lat1, payload.lng1, payload.lat2, payload.lng2);

	Accident.find({
		'point.lng': {$gt: boundingBox.lngMin, $lt: boundingBox.lngMax},
		'point.lat': {$gt: boundingBox.latMin, $lt: boundingBox.latMax}
	}).limit(7).exec(function (err, acc) {
		var box = geoutils.actualBox(acc.point.lat, acc.point.lng, 100);
		unsafeAreas.push(box);
		if (unsafeAreas.length == 7){
            request
                .get(BASE_URL)
                .query({app_id: APP_ID, app_code: APP_CODE,
                    waypoint0: 'geo!'+payload.lat1+','+payload.lng1,
                    waypoint1: 'geo!'+payload.lat2+','+payload.lng2,
                    mode: 'fastest;publicTransport',
                    departure: 'now',
                    avoidAreas: boxArrayToString(unsafeAreas),
                    combineChange: 'true',
                    representation: 'display',
                    routeAttributes: 'waypoints,summary,shape'
                })
                .end(function(err, res){
                    if (!res.body || !res.body.Response){
                        var message = 'Notre service a rencontré une erreur.';
                        console.log(res.body, err);
                        return
                    }
                    console.log(res.body.response.route[0], res.body.response.route[0].shape);
                    var routes = res.body.response.route;

                    resp.setHeader('Content-Type', 'application/json');
                    resp.send(JSON.stringify({routes: routes, message: message || ''}));

                });
		}
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
