'use strict';

module.exports = function () {
    var mongoose = require('mongoose');
    var MovieSchema = mongoose.Schema({
        title: String,
        description: String,
        cast: String,
        price: Number,
        language: {type: String, default: 'NA'},
        movieUrl: {type: String, default: 'NA'},
        coverUrl: {type: String, default: 'NA'},
        thumbnailUrl: {type: String, default: 'NA'},
        cloudMovieUrl: {type: String, default: 'NA'},
        cloudCoverUrl: {type: String, default: 'NA'},
        cloudThumbUrl: {type: String, default: 'NA'},
        rating:{type:Number, default:0},
        views: {type: Number, default:0},
        earning: {type: Number, default:0},
        featuredlistAd: {type: String, default: 'No'},
        landingpageAd: {type: String, default: 'No'},
        coverAd: {type: String, default: 'No'},
        approveFlag: {type: Boolean, default: true},
        payment:[{type: mongoose.Schema.Types.ObjectId, ref:'PaymentModel'}],
        created: {type: Date, default: Date.now},
        comment:[{type: mongoose.Schema.Types.ObjectId, ref:'CommentModel'}]
    }, {collection: 'movie'});
    return MovieSchema;
};
