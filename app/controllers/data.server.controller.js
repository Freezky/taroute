/**
 * Created by kevynbele-binda on 2017-03-11.
 */

var currentWeather; //TODO get request to weather API
var accidentReport; //TODO: Pass JSON from Dennis' API

exports.removeHyphenDate = function(strDate){
    var newStr;
    newStr = strDate.replace(/-/g, "");
    return newStr;
};

exports.findConditionByDate = function (date) {
    {
        var condition;
        formattedDate = removeHyphenDate(date);

        return condition;
    }
};

exports.compareWeatherCondition = function (currentWeatherCondition) {
    return findConditionByDate(date) === currentWeatherCondition;
};

exports.addGravityLevelToWeatherCondition = function (condition) {

}



