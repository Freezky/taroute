/**
 * Created by kevynbele-binda on 2017-03-11.
 */

var currentWeather; //TODO get request to weather API
var accidentReport = require('../../AccidentReports.json');
var request = require('superagent');
//var Accident = require('mongoose').model('Accident');


BASE_URL = 'http://api.wunderground.com/api/073a00e6d50e4781/history_';

/*
exports.getWeatherCondition = function (dateFormated){
    var test = dateFormated;
    request.get('http://api.wunderground.com/api/073a00e6d50e4781/history_20151012/geolookup/conditions/forecast/q/Canada/Montreal.json').end(function(err, res){
        if (!res || !res.body.response){
            console.log(res, err);
            return
        }
        return res.body.weather;
    })
}
*/

exports.removeHyphenDate = function(strDate){
    var newStr;
    newStr = strDate.replace(/-/g, "");
    return newStr;
};

/*exports.findConditionByDate = function (date) {
    {
        var condition;
        formattedDate = removeHyphenDate(date);

        return condition;
    }
};*/

exports.compareWeatherCondition = function (currentWeatherCondition) {
    return findConditionByDate(date) === currentWeatherCondition;
};

exports.addGravityLevelToWeatherCondition = function (condition) {

}



