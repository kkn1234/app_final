'use strict';
(function () {
    var app = angular.module('studiobuzz');

    app.controller('MembershipTermsController', ['$location','$routeParams', 'ezfb',
        function ($location, $routeParams, ezfb) {
            var vm = this;

            vm.membershipProceed = membershipProceed;
            vm.membershipCancel = membershipCancel;

            function membershipCancel() {
                navMoviesLogout();
            }


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



            function membershipProceed() {
                var id = $routeParams.duid;
                var url = '/dashboard/'+ id +'/membership-account';
                $location.url(url);
            }

        }]);
})();
