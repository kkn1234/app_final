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


            var movieObj = function () {
                MovieService.findAllMovie().then(function (movie) {
                    vm.movies = movie.data;
                    console.log(vm.movies);
                }, function (err) {
                    console.log(err + 'error');
                });
            };

            movieObj();

            var userObj = UserService.findAllUser().then(function (user) {
                vm.user = user.data;
                console.log([vm.user, user]);
            }, function (err) {
                console.log(err);
            });

            //get login status
            ezfb.getLoginStatus(function (res) {
                var loginStatus = res;
                if (loginStatus.status === 'connected') {
                    vm.isLoggedIn = true;
                }
            });

            //fb login
            vm.fbLogin = function () {
                vm.isBusy = !vm.isBusy;
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
                var findUser = UserService.findUserByfbId(fbId).then(function (result) {
                    console.log(result);
                    var user = result.data;
                    if(user === '0'){
                        createUser(newUser);
                    }else if(user !== '') {
                        var url = '/user/'+ user._id +'/home';
                        $location.url(url);
                        console.log([user, url]);
                    }
                }, function (err) {
                    vm.error = true;
                });
            }



        }]);
})();

