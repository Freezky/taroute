var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
// var accidentReport = require('../../GeoAccidents.json');


var StationSchema = new Schema({
        lat: Number,
        lng: Number,
        type: String,
        available: Boolean
});

// StationSchema.virtual('location').get(function() {
//     return this.civicNumber + ' ' + this.road;
// });

StationSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Station', StationSchema);

exports.StationSchema = StationSchema;
