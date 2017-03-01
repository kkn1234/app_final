'use strict';

(function () {
    var app = angular.module('studiobuzz');

    app.controller('MoviePlayController', ['MovieService', '$routeParams', '$sce',
        'UserService', '$scope', '$location', 'MovieRatingService', 'PaymentService', 'ezfb',
        function (MovieService, $routeParams, $sce, UserService,
                   $scope, $location, MovieRatingService, PaymentService, ezfb) {
            var vm = this;
            var userId = $routeParams.uid;
            var movieId = $routeParams.mid;
            vm.fbUrl = 'http://studiobuzz.in/#!/movie-play/' + movieId;
            vm.userReview = userReview;
            var userObj = {};
            vm.navMoviesList = navMoviesList;
            vm.navMoviesHome = navMoviesHome;
            vm.navMoviesLogout = navMoviesLogout;
            vm.isLoggedIn = false;

            //get login status
            ezfb.getLoginStatus(function (res) {
                var loginStatus = res;
                if (loginStatus.status === 'connected') {
                    vm.isLoggedIn = true;
                }
            });

            function navMoviesLogout() {
                if (vm.isLoggedIn) {
                    ezfb.logout().then(function(res) {
                        $location.url('/');
                    });
                } else {
                    $location.url('/');
                }
            }




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
                    }

                });

            };

            function addMovieRating() {
                MovieRatingService.findMovieRating(movieId).then(function (movie) {
                         var rating = movie.rating;
                        console.log([rating, 'movie rating update']);
                        MovieService.updateRating(rating,movieId).then(function (result) {
                        }, function (err) {
                            console.log(err);
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
                    }else {
                        var movieObj = MovieRatingService.createMovieRating(movieId).then(function (movie) {
                            vm.movieRating = movie.rating;
                        }, function (err) {
                            console.log(err);
                        });
                    }
                }, function (err) {
                    console.log(err);
                });
            };

            var ratingObj = [];
            var getUserRating = function () {
                var user = UserService.findUserById(userId).then(function (result) {
                    var userData = result.data;
                    userObj = user;
                    var ratingArr = userData.rating;
                    for(var r in ratingArr){
                        var mId = ratingArr[r].movieId;
                        if(mId === movieId){
                            ratingObj.push(ratingArr[r]);
                            console.log([ratingObj, 'user rating object']);
                        }
                        if(ratingObj.length > 0){
                            vm.ratingflag = ratingObj[0].ratingflag;
                            vm.userRating = ratingObj[0].rating;
                        }else {
                            vm.ratingflag = false;
                        }
                    }
                });
            };

            function userReview(userstar) {
                console.log('button clicked');
                if(!vm.ratingflag){
                    console.log('true');
                    var movieRating = MovieRatingService.updateMovieRating(userstar, movieId).then(function (res) {
                        console.log([res , 'res']);
                        getMovieRating();
                        addMovieRating();
                        var ratingObj = {
                            rating: userstar, movieId: movieId, ratingflag: true
                        };
                        var rating = UserService.updateUserRating(userId, ratingObj).then(function (obj) {
                            getUserRating();
                        }, function (err) {
                            console.log(err);
                        });
                    }, function (err) {
                        console.log(err);
                    });

                }
            }

            var movie = MovieService.findMovieById(movieId).then(function (movie) {
                vm.movie = movie.data;
                console.log(vm.movie);
                // var src = movie.data.cloudMovieUrl;
                var src = 'https://dpwrg5f5s7hgb.cloudfront.net/58b6937c7d59503792414187.mp4';
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

            vm.MovieByList = function (movielist) {
                switch (movielist) {
                    case 'upcoming':
                        $location.url('/user/'+ userId +'/home/upcoming');
                        break;

                    case 'popular':
                        $location.url('/user/'+ userId +'/home/popular');
                        break;

                    case 'current':
                        $location.url('/user/'+ userId +'/home/currently-watching');
                        break;

                }

            };


        }]);
})();
