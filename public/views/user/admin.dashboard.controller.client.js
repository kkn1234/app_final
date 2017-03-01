(function () {
    'use strict';
    var app = angular.module('studiobuzz');

    app.controller('AdminDashboardController', ['$scope', '$location', 'ezfb', 'UserService', 'MovieService',
        function ($scope, $location, ezfb, UserService, MovieService) {
            var vm = this;
            vm.isLoggedIn = false;

            vm.movieApproveStatus = function (movieId, flag) {
                console.log([movieId, flag]);
                MovieService.movieApproveStatus(movieId, flag).then(function (result) {
                    console.log(result);
                    movieObj();
                }, function (err) {
                    console.log(err);
                });
            };


            // var movieObj = function () {
                MovieService.findAllMovie().then(function (movie) {
                    vm.movies = movie.data;
                    console.log(vm.movies);
                }, function (err) {
                    console.log(err + 'error');
                });
            // };



            var userObj = function () {
                UserService.findAllUser().then(function (user) {
                    vm.user = user.data;
                    console.log([vm.user, user]);
                }, function (err) {
                    console.log(err);
                });
            };


            //get login status
            ezfb.getLoginStatus(function (res) {
                var loginStatus = res;
                if (loginStatus.status === 'connected') {
                    vm.isLoggedIn = true;
                }
            });

            // logout if status connected
            vm.logout = function () {
                if (vm.isLoggedIn) {
                    ezfb.logout().then(function (res) {
                        $location.url('/');
                    });
                }else {
                    $location.url('/');
                }
            };
            //fb login
            vm.fbLogin = function () {
                if(vm.isLoggedIn){
                    getUserInfo();
                }else {
                    callFbLogin();
                }
            };

            //cal fb login
            function callFbLogin() {
                ezfb.login().then(function(res) {
                    if(res.status === "connected"){
                        console.log(res);
                        getUserInfo();
                    }
                });
            }

            //Get user info
            function getUserInfo() {
                ezfb.api('/me', function (res) {
                    vm.apiMe = res;
                    //create user
                    console.log(vm.apiMe);
                    vm.isBusy = false;
                    findUser(res);
                });
            }


            function findUser(user) {
                var newUser = {
                    username: user.name,
                    fbId: user.id
                };
                var fbId = user.id;
                if(fbId === '156557088192838'){
                    console.log('Equal');
                    movieObj();
                    userObj();
                }else {
                    $location.url('/');
                }
            }

            vm.fbLogin();


        }]);
})();

