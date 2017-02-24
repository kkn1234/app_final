'use strict';

(function () {
    var app = angular.module('studiobuzz');

    app.controller('MembershipLoginController', ['$scope','$location', 'ezfb', 'MembershipUserService',
        function ($scope, $location, ezfb, MembershipUserService) {
            var vm = this;
            vm.error = false;
            vm.isLoggedIn = false;
            var createMembershipUser = createMembershipUser;
            var findMembershipUser = findMembershipUser;

            function findMembershipUser(user) {
                var newUser = {
                    username: user.name,
                    fbId: user.id
                };
                var fbId = user.id;
                var findUser = MembershipUserService.findUserByfbId(fbId).then(function (result) {
                    console.log(result);
                    var user = result.data;
                    if(user === '0'){
                        createMembershipUser(newUser);
                    }else if(user !== '') {
                        var url = '/dashboard/'+ user._id +'/dashboard-home';
                        $location.url(url);
                        console.log('user present');
                    }
                }, function (err) {
                    vm.error = true;
                });
            }

            function createMembershipUser(user) {

                var create = MembershipUserService.createMembershipUser(user).then(function (newUser) {
                    var user = newUser.data;
                    var url = '/dashboard/'+ user._id +'/membership-terms';
                    console.log([url, user]);
                    if(newUser.status === 200){
                        $location.url(url);
                    }
                }, function (err) {
                    vm.error = true;
                });
            }


            //fb login

            //get login status
            ezfb.getLoginStatus(function (res) {
                var loginStatus = res;
                if (loginStatus.status === 'connected') {
                    vm.isLoggedIn = true;
                }
            });

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
                    console.log(res);
                    if(res.status === "connected"){
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
                    findMembershipUser(res);
                });
            }


        }]);
})();

