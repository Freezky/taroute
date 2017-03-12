var fs = require('fs');
var getSafeDirections = require('./controllers/itineraries.server.controller.js').getSafeDirections;
var utils = require('./utils.js');
var request = require('superagent');
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
//geocodeAccidents();

function geocodeAccidents(){
	var data;
	var count = 0;
	var geoAccidents = [];
	try {
		data = fs.readFileSync('../GeoAccidents.json', 'utf8');
	} catch(err) {
		console.log(err);
	}	
	if (!data){
		var accidentReports = require('../AccidentReports.json').value;//utils.getDistinctLocations();
		//var keys = Object.keys(accidentReports);
		var locationName;
		locationName = accidentReports[0]["NO_CIVIQ_ACCDN"] + ' ' + accidentReports[0]["RUE_ACCDN"];
		console.log(locationName);
		var getGeo = function(locationName, i, cb){
			request.get(map_url).query({
			key: map_key,
			location: locationName + ', Montreal, QC, Canada',
			country: 'Canada',
			city: 'Montréal',
		}).end(function(err, res){
			console.log('OK');
			var report = accidentReports[i];
			console.log('report', !!report);
			if (res && res.body.results && res.body.results[0]){
				//console.log(res.body.results[0]);
				var geoPoint = res.body.results[0].locations[0].latLng;
				geoAccidents.push({
					point: geoPoint, 
					locationName: locationName,
					gravity: report && report['gravite'], 
					totalNumberOfVictims: parseInt(report['NB_VICTIMES_TOTAL'], 0), 
					numberOfPedestrian: parseInt(report['NB_VICTIMES_PIETONS'], 0), 
					numberOfCyclists: parseInt(report['NB_VICTIMES_VELO'], 0),
					weather: parseInt(report['CD_COND_METEO'] || 0), 
					date: report['DT_ACCDN'],
				});
				console.log(geoAccidents.length);
				//cb(keys[i + 1], i + 1, cb);
				if(geoAccidents.length > 4300){

					fs.writeFile('../GeoAccidents.json', JSON.stringify({values: geoAccidents}), 'utf8', function(){console.log('New JSON file saved !'); 
						console.log('DONE ! YEAH');
						return;
					});
		
				}
				return;
			}
			geoAccidents.push(null);
			console.log(err);

		});
	};
	getGeo(locationName, 0, getGeo);
	for (var i=1; i < accidentReports.length; i++){
		locationName = accidentReports[i]["NO_CIVIQ_ACCDN"] + ' ' + accidentReports[i]["RUE_ACCDN"];
		getGeo(locationName, i, getGeo);	
	}

	}
}


function pushBixiInDB(){
	var bixies = require('../BixiStations.json').value;
	var StationSchema = require('./models/stations.server.model.js');
	var Station = mongoose.model('Station');
	bixies.map(function(bixi){
		Station.create({lat: bixi.la, lng: bixi.lo, type: 'bixi', available: !(bixi.b || bixi.su || bixi.m)});	
	});
		
}

function pushAccidentInDB(){
	var accidentReport = require('../../GeoAccidents.json');
	var DataSchema = require('./models/itineraries.server.model.js').DataSchema;
	var Accident = mongoose.model('Accident');
	accidentReport.values.map(function(o, i){
	    if(o){
	        Accident.create({
	            point: o.point,
	            date: o.date,
	            gravity: o.gravity,
	            totalNumberOfVictims: o.totalNumberOfVictims,
	            numberOfPedestrian: o.numberOfPedestrian,
	            numberOfCyclist: o.numberOfCyclist,
	            road: o.road,
	            condition: o.weather
	        });
	    }
	});

}

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/taRouteDev');
pushAccidentInDB();
pushBixiInDB();
/*
var geovals = [];
for (var i; i < tab.length; i++){
	$('#street').val(tab[i]);
	$('#btnGC').click();
	setTimeout(function(){
		geovals.push([$('#latitudeID').text(), $('#longitudeID').text() ]);
	}, 100);
}

*/