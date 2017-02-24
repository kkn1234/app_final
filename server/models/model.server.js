'use strict';
module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://studiobuzz:studiobuzz@ds157549.mlab.com:57549/studio_test');
    var dbURI = 'mongodb://studiobuzz:studiobuzz@ds157549.mlab.com:57549/studio_test';
    var db = mongoose.connection;

    db.on('error', function(error) {
        console.error('Error in MongoDb connection: ' + error);
        mongoose.disconnect();
    });
    db.on('disconnected', function() {
        console.log('MongoDB disconnected!');
        mongoose.connect(dbURI, {server:{auto_reconnect:true}});
    });
    mongoose.connect(dbURI, {server:{auto_reconnect:true}});

    var membershipModel = require('./membership/membership-user.model.server')();
    var movieModel = require('./movie/movie.model.server')();
    var userModel = require('./user/user.model.server')();
    var paymentModel = require('./payment/payment.model.server')();
    var ratingModel = require('./rating/rating.model.server')();

    var model = {
        membershipModel: membershipModel,
        movieModel: movieModel,
        userModel: userModel,
        paymentModel: paymentModel,
        ratingModel: ratingModel
    };

    membershipModel.setModel(model);
    movieModel.setModel(model);
    userModel.setModel(model);
    paymentModel.setModel(model);
    ratingModel.setModel(model);


    return model;
};
