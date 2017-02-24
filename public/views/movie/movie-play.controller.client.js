'use strict';

(function () {
    var app = angular.module('studiobuzz');

    app.controller('MoviePlayController', ['MovieService', '$routeParams', '$sce',
        'UserService', '$scope', '$location', 'MovieRatingService', 'PaymentService',
        function (MovieService, $routeParams, $sce, UserService,
                   $scope, $location, MovieRatingService, PaymentService) {
            var vm = this;
            var userId = $routeParams.uid;
            var movieId = $routeParams.mid;
            vm.fbUrl = 'http://localhost:8080/#!/movie-play/' + movieId;
            vm.userReview = userReview;
            var userObj = {};
            vm.navMoviesList = navMoviesList;
            vm.navMoviesHome = navMoviesHome;



            function navMoviesList() {
                var url = '/user/'+userId+ '/home/movieslist';
                $location.url(url);
            }

            function navMoviesHome() {
                var url = '/user/'+userId+ '/home';
                $location.url(url);
            }


            vm.movieRatingInit = function () {
                getUserRating();
                getMovieRating();
            };

            vm.mediaCompleted = function () {

                var payId = $routeParams.pid;
                PaymentService.findPaymentById(payId).then(function (payment) {
                    console.log([payment, 'payment']);
                    var data = payment.data.earning;

                    if(!payment.data.flag){
                        var view = 1;
                        vm.views = MovieService.incrementView(view,data, movieId);
                        PaymentService.updateFlag(payId);
                        // MovieService.updateEarning(data, movieId);
                    }

                });

            };

            function addMovieRating() {
                MovieRatingService.findMovieRating(movieId).then(function (movie) {
                         var rating = movie.rating;
                        console.log([rating, 'movie rating update']);
                        MovieService.updateRating(rating,movieId).then(function (result) {
                            getMovieRating();
                        });
                }, function (err) {
                    console.log(err);
                });
            }

            var getMovieRating = function () {
                var movie = MovieRatingService.findMovieRating(movieId).then(function (movie) {
                    if(movie !== '0'){
                        vm.movieRating = movie.rating;
                        console.log([rating, 'movie rating update']);
                    }
                }, function (err) {
                    console.log(err);
                });
            };

            var getUserRating = function () {
                var user = UserService.findUserById(userId).then(function (result) {
                    var user = result.data;
                    userObj = user;
                    if(user.ratingFlag === true){
                        vm.ratingflag = true;
                        vm.userRating = user.rating;
                    }
                });
            };

            function userReview(userstar) {
                UserService.findUserById(userId).then(function (result) {
                    var userData = result.data;
                    console.log(userstar);
                    if(userData.ratingFlag === false){
                        var userRating = {userRating: true,rating:userstar};
                        var rating = UserService.updateUserRating(userId, userRating).then(function (obj) {
                            var user = obj.data;
                            console.log([user, ' userupdateaaa']);
                            vm.ratingflag = user.ratingFlag;
                            var userRating = MovieRatingService.updateMovieRating(userstar, movieId).then(function (res) {
                                console.log([res , 'res']);
                                getMovieRating();
                                addMovieRating();
                                vm.ratingflag = true;
                            });
                            console.log([user, ' userupdate']);
                        });
                    }
                });
            }

            var movie = MovieService.findMovieById(movieId).then(function (movie) {
                vm.movie = movie.data;
                console.log(vm.movie);
                var src = movie.data.cloudMovieUrl;
                vm.image = vm.movie.cloudThumbUrl;
                vm.config = {
                    preload: "none",
                    sources: [
                        {src: $sce.trustAsResourceUrl(src), type: "video/mp4"},
                        {src: $sce.trustAsResourceUrl(src), type: "video/webm"},
                        {src: $sce.trustAsResourceUrl(src), type: "video/ogg"}
                    ],
                    theme: {
                        url: "../../css/videogular.css"
                    },

                    plugins: {
                        posterImage: vm.movie.cloudCoverUrl,
                        controls: {
                            autoHide: true,
                            autoHideTime: 5000
                        }
                    }
                };

            }, function (err) {
                console.log(err);
            });



        }]);
})();
