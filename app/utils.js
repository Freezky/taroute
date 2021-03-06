var request = require('superagent');

const APP_ID = 'JU13C2QwBtMUR7NVqlOi';
const APP_CODE = 'FHfevJrLfCmT5nMD2Vchfw';
const BASE_URL = 'https://geocoder.cit.api.here.com/6.2/geocode.json';
const map_url = 'http://www.mapquestapi.com/geocoding/v1/address';

const NAD83_a = 6378137.0;  // Major semiaxis [m]
const NAD83_b = 6356752.3141 // Minor semiaxis [m]

/**
* filter AccidentReports.json to group accidents per location
*/
exports.getDistinctLocations = function(){
	var AccidentReports = require('../AccidentReports.json');
	var distinctLocations = {};
	AccidentReports.value.map(function(report, i){
		var key = report["NO_CIVIQ_ACCDN"] + ' ' + report["RUE_ACCDN"];
		if (!distinctLocations[key]){
			distinctLocations[key] = {count: 1, 
				gravity: report['gravite'], 
				totalNumberOfVictims: parseInt(report['NB_VICTIMES_TOTAL'], 0), 
				numberOfPedestrian: parseInt(report['NB_VICTIMES_PIETONS'], 0), 
				numberOfCyclists: parseInt(report['NB_VICTIMES_VELO'], 0),
				weather: parseInt(report['CD_COND_METEO'] || 0), 
				date: report['DT_ACCDN']
			}
		} else {
			distinctLocations[key].totalNumberOfVictims += parseInt(report['NB_VICTIMES_TOTAL'], 0);
			distinctLocations[key].numberOfPedestrian += parseInt(report['NB_VICTIMES_PIETONS'], 0);
			distinctLocations[key].numberOfCyclists += parseInt(report['NB_VICTIMES_VELO'], 0);
		}
	});
	console.log('distinctLocations', Object.keys(distinctLocations).length);
	return distinctLocations;
};

function getBoundingBox(lat1, lng1, lat2, lng2){
	var midPoint = computeMidPoint(lat1, lng1, lat2, lng2);
	var halfSide = computeDistance(lat1, lng1, lat2, lng2)/2;
	var R = getEarthRadius(midPoint.lat);
	var pR = R * math.cos(lat); // radius of parallel at this latitude
	return {
		latMin: (midPoint.lat - halfSide/R).toDegrees(),
		latMax: (midPoint.lat + halfSide/R).toDegrees(),
		lngMin: (midPoint.lng - halfSide/pR).toDegrees(),
		lngMax: (midPoint.lng + halfSide/pR).toDegrees()
	}
}

exports.actualBox = function(lat, lng, dist) {
    var R = getEarthRadius(lat);
    var pR = R * math.cos(lat); // radius of parallel at this latitude
	var halfSide = dist;
    return {
        latMin: (lat - halfSide/R).toDegrees(),
        latMax: (lat + halfSide/R).toDegrees(),
        lngMin: (lng - halfSide/pR).toDegrees(),
        lngMax: (lng + halfSide/pR).toDegrees()
    }
};

function computeDistance (lat1, lng1, lat2, lng2){
	var lat1 = lat1.toRadians();
	var lat2 = lat2.toRadians();
	var R = getEarthRadius(lat1, lng1); // about 6371e3 metres
	var dlat = lat2 - lat1;
	var dlng = (lng2-lng1).toRadians();

	var a = Math.sin(dlat/2) * Math.sin(dlat/2) +
	        Math.cos(lat1) * Math.cos(lat2) *
	        Math.sin(dlng/2) * Math.sin(dlng/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return R * c;
}

function computeMidPoint (lat1, lng1, lat2, lng2){
	// Gives coordinates of midpoint between 
	// the given positions (radians)
	var dlng = degToRad(lng2 - lng1);
	lat1 = degToRad(lat1);
	lat2 = degToRad(lat2);
	lng1 = degToRad(lng1);
	lng2 = degToRad(lng2);
	var bx = Math.cos(lat2) * Math.cos(dlng);
	var by = Math.cos(lat1) * Math.sin(dlng);
	var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), 
					Math.sqrt((Math.cos(lat1) + bx) * 
						(Math.cos(lat1) + bx) + by * by));
    var lng3 = lng1 + Math.atan2(by, Math.cos(lat1) + bx);
    return {lat: lat3, lng: lng3};
}

function getEarthRadius(lat){
	// Gives better earth radius (than the mean) for Quebec. 
	// It's HackQC, we are in Quebec ! What else ?
	// Semi-axes of WGS-84 geoidal reference
	var An = NAD83_a*NAD83_a * Math.cos(lat)
    var Bn = NAD83_b*NAD83_b * Math.sin(lat)
    var Ad = NAD83_a * Math.cos(lat)
    var Bd = NAD83_b * Math.sin(lat)
    return Math.sqrt((An*An + Bn*Bn)/(Ad*Ad + Bd*Bd) )
}

function degToRad(deg){
	return deg/180 * Math.PI;
}

function radToDeg(rad){
	return rad/Math.PI * 180;
}

exports.getBoundingBox = getBoundingBox;
exports.computeDistance = computeDistance;