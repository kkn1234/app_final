'use strict';

module.exports = function () {
    var model = {};
    var mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    var UserSchema = require('./user.schema.server')();
    var UserModel = mongoose.model('UserModel', UserSchema);

    var api = {
        createUser: createUser,
        findUserByfbId: findUserByfbId,
        findUserById: findUserById,
        updateUserRating:updateUserRating,
        findAllUser: findAllUser,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }


    function findAllUser() {
        var promise = UserModel.find().then(function (user) {
            return user;
        }, function (err) {
            return err;
        });
        return promise;
    }


    function updateUserRating(ratingObj, userId) {
      var promise = UserModel.findById(userId).then(function (user) {
        user.rating.push(ratingObj);
        return user.save();
      }, function (err) {
        return err;
      });
        // var promise = UserModel.findOneAndUpdate({_id: userId}, {
        //     ratingFlag:ratingflag}, {
        //       $push: {rating: rating}
        // }, done).then(function (user) {
        //     return user;
        // }, function (err) {
        //     return err;
        // });
        return promise;
    }


    function findUserById(userId) {
        var promise = UserModel.findById(userId).then(function (user) {
            return user;
        }, function (err) {
            return err;
        });
        return promise;
    }

    function findUserByfbId(fbId) {
        var promise = UserModel.findOne({fbId: fbId}).then(function (result) {
            return result;
        }, function (err) {
            return err;
        });
        return promise;
    }

    function createUser(user) {
        var promise = UserModel.create(user).then(function (result) {
            return result;
        }, function (err) {
            return err;
        });
        return promise;
    }

};
