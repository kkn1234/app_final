'use strict';

module.exports = function (app, model) {

    app.post('/api/user/create', createUser);
    app.get('/api/user/:fbId', findUserByfbId);
    app.get('/api/user/id/:uid', findUserById);
    app.post('/api/user/:uid', updateUserRating);
    app.get('/api/user', findAllUser);

    function findAllUser(req, res) {
        model.userModel.findAllUser().then(function (movies) {
            res.send(movies);
        }, function (err) {
            res.sendStatus(400);
        });
    }

    function  updateUserRating(req, res) {
        var userId = req.params.uid;
        var ratingflag = req.body;
        var rating = req.body;
        var ratingObj = {
          rating: rating.rating, movieId: rating.movieId, ratingflag: rating.ratingflag
        };
        console.log(rating);
        model.userModel.updateUserRating(ratingObj, userId).then(function (result) {
            console.log(result);
            res.send(result);
        }, function (err) {
            res.sendStatus(400).send(err);
        });
    }

    function findUserById(req, res) {
        var userId = req.params.uid;
        model.userModel.findUserById(userId).then(function (result) {
            res.send(result);
        }, function (err) {
            res.sendStatus(400);
        });
    }




    function findUserByfbId(req, res) {
        var fbId = req.params.fbId;
        model.userModel.findUserByfbId(fbId).then(function (result) {
            if(result ===  null){
                res.send('0');
            }else {
                res.send(result);
            }

        }, function (err) {
            res.sendStatus(400);
        });
    }

    function createUser(req, res) {
        var user = req.body;
        model.userModel.createUser(user).then(function (result) {
            res.send(result);
        }, function (err) {
            res.sendStatus(400).send(err);
        });
    }
};
