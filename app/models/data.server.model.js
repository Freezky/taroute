/**
 * Created by kevynbele-binda on 2017-03-11.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var dataSchema = new Schema({
    date: String,
    gravity: String,
    totalNumberOfVictims: int,
    numberOfPedestrian: int,
    numberOfCyclist: int,
    civicNumber: String,
    road: String
});

UserSchema.virtual('location').get(function() {
    return this.civicNumber + ' ' + this.road;
}).set(function(location) {
    var splitName = location.split(' ');
    this.civicNumber = splitLocation[0] || '';
    this.road = splitLocation[1] || '';
});

dataSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Accident', dataSchema);