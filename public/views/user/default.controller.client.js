(function () {
    'use strict';
    var app = angular.module('studiobuzz');

    app.controller('DefaultPageController', ['$scope', '$location', 'ezfb', 'UserService', 'MovieService',
        function ($scope, $location, ezfb, UserService, MovieService) {
            var vm = this;
            vm.isBusy = false;
            vm.isLoggedIn = false;
            vm.myInterval = 3000;
            vm.noWrapSlides = false;
            vm.active = 0;


            var thumbnailImage = MovieService.findAllMovie().then(function (movie) {
                vm.movie = [];
                for(var a in movie.data){
                    if(movie.data[a].approveFlag){
                        console.log('Flag is true');
                        vm.movie.push(movie.data[a]);
                    }
                }
            }, function (err) {
                console.log(err + 'error');
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

            function createUser(user) {
                var create = UserService.createUser(user).then(function (newUser) {
                    var user = newUser.data;
                    var url = '/user/'+ user._id +'/home';
                        $location.url(url);
                        console.log([user, url]);
                }, function (err) {
                    vm.error = true;
                });
            }

        //membership
            vm.membershipLogin = function () {
                ezfb.getLoginStatus(function (res) {
                    if(vm.isLoggedIn){
                        ezfb.logout(function (res) {
                            vm.isLoggedIn = false;
                            $location.url('/login');
                        });
                    }else {
                        $location.url('/login');
                    }
                });
            };


        }]);
})();

