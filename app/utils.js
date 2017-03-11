
const WGS84_a = 6378137.0;  // Major semiaxis [m]
const WGS84_b = 6356752.3; // Minor semiaxis [m]

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
    var lng3 = lng1 + Math.atan2(By, Math.cos(lat1) + bx);
    return {lat: lat3, lng: lng3};
}

function getEarthRadius(lat){
	// Gives better earth radius (than the mean) for Quebec. 
	// It's HackQC as in Quebec ! What else ?
	// Semi-axes of WGS-84 geoidal reference
	var An = WGS84_a*WGS84_a * Math.cos(lat)
    var Bn = WGS84_b*WGS84_b * Math.sin(lat)
    var Ad = WGS84_a * Math.cos(lat)
    var Bd = WGS84_b * Math.sin(lat)
    return Math.sqrt((An*An + Bn*Bn)/(Ad*Ad + Bd*Bd) )
}

function degToRad(deg){
	return deg/180 * Math.PI;
}

function radToDeg(rad){
	return rad/Math.PI * 180;
}
