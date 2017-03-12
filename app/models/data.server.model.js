/**
 * Created by kevynbele-binda on 2017-03-11.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var db = mongoose.connect('mongodb://localhost/taRouteDev');
var accidentReport = require('../../AccidentReports.json');
var dataContro = require('../controllers/data.server.controller');


var DataSchema = new Schema({
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


accidentReport.value.map(function(o, i){
    Accident.create({
        gravity: o.gravite,
        totalNumberOfVictims: o.NB_VICTIMES_TOTAL,
        numberOfPedestrian: o.NB_VICTIMES_PIETON,
        numberOfCyclist: o.NB_VICTIMES_VELO,
        civicNumber: o.NO_CIVIQ_ACCDN,
        road: o.RUE_ACCDN,
        condition: findWeatherConditionByDate(removeHyphenDate(o.DT_ACCDN))
    });
});

function removeHyphenDate(strDate){
    var newStr;
    newStr = strDate.replace(/-/g, "");
    return newStr;
}
console.log(removeHyphenDate('2015-10-11'));

function findWeatherConditionByDate(strDate) {

    return dataContro.getWeatherCondition(strDate);
}

/*function avgVictim() {
    var sum = 0;
    var count = 0;
    accidentReport.value.map(function (o, i) {
        sum += parseInt(o.NB_VICTIMES_TOTAL);
        count++;
    });
    console.log(sum/count);
}
avgVictim();
var distinctkeys = countLocationsWithSeveralAccidents();
var keysOver2 = Object.keys(distinctkeys).filter(function (e) {
    return distinctkeys[e] > 2;
});
console.log(keysOver2, keysOver2.length);

function countLocationsWithSeveralAccidents(){
    var distinctKeys = {};
    accidentReport.value.map(function (o, i) {
        distinctKeys[o.NO_CIVIQ_ACCDN + ' ' + o.RUE_ACCDN] = (
        distinctKeys[o.NO_CIVIQ_ACCDN + ' ' + o.RUE_ACCDN]  &&
        distinctKeys[o.NO_CIVIQ_ACCDN + ' ' + o.RUE_ACCDN] + 1 || 1);
    });
    console.log(distinctKeys, accidentReport.value.length);
    return distinctKeys;
}*/
