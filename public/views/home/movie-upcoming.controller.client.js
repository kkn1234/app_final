'use strict';

(function () {
    var app = angular.module('studiobuzz');

    app.controller('MovieUpcomingController', ['MovieService', '$routeParams',
        '$location' , 'ezfb', function (MovieService, $routeParams, $location, ezfb) {
            var vm = this;
            var userId = $routeParams.uid;
            vm.myInterval = 5000;
            vm.noWrapSlides = false;
            vm.active = 0;
            vm.isLoggedIn = false;
            //movie nav tab
            vm.viewtab = false;
            vm.featuretab = true;
            vm.ratingtab = false;
            vm.recenttab = false;
            //function

            vm.watchMovieById = watchMovieById;
            vm.navMoviesHome = navMoviesHome;

            vm.viewNavTab = function (prop, val) {
                return function (item) {
                    if(item[prop] >= val) return true;
                }
            };

            var movie = MovieService.findAllMovie().then(function (movie) {
                vm.movie = [];
                for(var a in movie.data){
                    if(movie.data[a].approveFlag){
                        console.log('Flag is true');
                        vm.movie.push(movie.data[a]);
                    }
                }
            }, function (err) {
                console.log(err);
            });

            function watchMovieById(mid) {
                $location.url('/user/' + userId + '/home/movie-pay/' + mid);
            }

            function navMoviesHome() {
                $location.url('/user/' + userId + '/home');
            }

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
