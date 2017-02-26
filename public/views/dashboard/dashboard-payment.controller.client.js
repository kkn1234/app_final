'use strict';

(function () {
    var app = angular.module('studiobuzz');

    app.controller('DashboardPaymentContoller', ['$routeParams', '$location', '$scope', 'ezfb',
        function ($routeParams, $location, $scope, ezfb) {
            var vm = this;
            vm.userId = $routeParams.duid;

            vm.navLogout = navLogout;
            vm.navHome = navHome;

            vm.isLoggedIn = false;

            //get login status
            ezfb.getLoginStatus(function (res) {
                var loginStatus = res;
                if (loginStatus.status === 'connected') {
                    vm.isLoggedIn = true;
                }
            });

            function navLogout() {
                if (vm.isLoggedIn) {
                    ezfb.logout().then(function(res) {
                        $location.url('/');
                    });
                } else {
                    $location.url('/');
                }
            }




            function navHome() {
                var userId = $routeParams.duid;
                var url = '/dashboard/'+userId+ '/dashboard-home';
                $location.url(url);
            }



        }]);
})();
