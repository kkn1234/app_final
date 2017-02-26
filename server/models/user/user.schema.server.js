'use strict';

module.exports = function () {
    var mongoose = require('mongoose');
    var UserSchema = mongoose.Schema({
        username: String,
        fbId: String,
        rating:[]
    }, {collection: 'user'});
    return UserSchema;
};
