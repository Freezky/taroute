var fs = require('fs');
var getSafeDirections = require('./controllers/itineraries.server.controller.js').getSafeDirections;
var utils = require('./utils.js');

const map_url = 'http://www.mapquestapi.com/geocoding/v1/address';

const map_key = '80h9d9SuOWXSNLpELrgpfvPonvftOBjx';
const map_secret = 'bmcaIF2wNoXCYVr0';

var payload = {
	// centre sportif uqam
	lat1: 45.512036,
	lng1: -73.559920,
	// western union
	lat2: 45.509841,
	lng2: -73.564072,
};

//getSafeDirections(payload);

//geocode();

function geocode(placeText){
	var request = require('superagent');
	var doneCount = {0: 0};
	// var done = false;
	// var point = {};
	console.log('food boys !');
	request.get(map_url).end(function(err, res){
			console.log('yo we got this');
			// done = true;
			doneCount[0] += 1;
			console.log(doneCount[0], !doneCount[0]);
			// if (!res || !res.body.Response){ 
			// 	_self.routes = []; _self.error = 'Notre service a rencontré une erreur.';
			// 	console.log(res, err);
			// 	return
			// }

			// console.log('Good job!', res.body.results[0].locations[0].latLng/*res.body.Response.View[0].Result[0].Location*/);
			// point = res.body.results[0].locations[0].latLng /*res.body.Response.View[0].Result[0].Location*/;
			// _self.addPoint(point, placeText);
		})
		// console.log('Not done');
		while (!doneCount[0]){};
		console.log('done');
}

function geocodeAccidents(){
	console.log('BOOM');
	var _self = this;
	try {
		this.data = fs.readFileSync('../GeoAccidents.json', 'utf8');
	} catch(err) {
		console.log(err);
	}	
	if (!this.data){
		this.accidentReports = utils.getDistinctLocations();
		this.geoAccidents = [];
		this.doneCount = 0;
		this.geocode = geocode.bind(this);
		var keys = Object.keys(this.accidentReports);
		keys.map(function(locationName){
			console.log(locationName);
			_self.geocode(locationName);
		}.bind(this));
		fs.writeFile('../GeoAccidents.json', {values: this.geoAccidents}, 'utf8', function(){console.log('New JSON file saved !')});
	}
}

geocodeAccidents.prototype.addPoint = function(geoPoint, locationName) {
	var report = this.accidentReports[locationName];
	this.geoAccidents.push({
		point: geoPoint, 
		locationName: report["NO_CIVIQ_ACCDN"] + ' ' + report["RUE_ACCDN"],
		gravity: report['gravite'], 
		totalNumberOfVictims: parseInt(report['NB_VICTIMES_TOTAL'], 0), 
		numberOfPedestrian: parseInt(report['NB_VICTIMES_PIETONS'], 0), 
		numberOfCyclists: parseInt(report['NB_VICTIMES_VELO'], 0),
		weather: parseInt(report['CD_COND_METEO'] || 0), 
		date: report['DT_ACCDN'],
	});
};

geocodeAccidents();
request.get(map_url).end(function(err, res){console.log(err, res)});