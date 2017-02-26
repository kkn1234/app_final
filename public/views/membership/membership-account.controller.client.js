'use strict';
(function () {
    var app = angular.module('studiobuzz');

    app.controller('MembershipAccountController', ['$routeParams','MembershipUserService',
        '$location', 'ezfb', function ($routeParams, MembershipUserService, $location, ezfb) {
            var vm = this;
            vm.error = false;
            vm.isBusy = false;
            vm.addAccountInfo = addAccountInfo;
            vm.cancelAccountInfo = cancelAccountInfo;
            var userId = $routeParams.duid;
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



            function addAccountInfo() {
                vm.isBusy = true;
                var account = {
                    accountName: vm.accountName,
                    accountNumber: vm.accountNumber,
                    bankName: vm.accountBank,
                    ifsc: vm.accountIfcs
                };
                var addaccount = MembershipUserService.addAccountInfo(userId, account).then(function (result) {
                    var status = result.status;
                    vm.isBusy = false;
                        var url = '/dashboard/'+ userId +'/dashboard-home';
                        $location.url(url);
                }, function (err) {
                    vm.error = true;
                });
            }
            function cancelAccountInfo() {
                $location.url('/');
            }


        }]);
})();

