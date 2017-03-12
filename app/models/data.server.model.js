/**
 * Created by kevynbele-binda on 2017-03-11.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var db = mongoose.connect('mongodb://localhost/taRouteDev');
var accidentReport = require('../../GeoAccidents.json');
var dataContro = require('../controllers/data.server.controller');


var DataSchema = new Schema({
    point: {
        lat: Number,
        lng: Number
    },
    date: String,
    gravity: String,
    totalNumberOfVictims: String,
    numberOfPedestrian: String,
    numberOfCyclist: String,
    civicNumber: String,
    road: String,
    condition: String
});

DataSchema.virtual('location').get(function() {
    return this.civicNumber + ' ' + this.road;
});

DataSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Accident', DataSchema);

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

