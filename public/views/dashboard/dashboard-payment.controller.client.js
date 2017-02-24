'use strict';

(function () {
    var app = angular.module('studiobuzz');

    app.controller('DashboardPaymentContoller', ['$routeParams', '$location', '$scope',
        function ($routeParams, $location, $scope) {
            var vm = this;
            vm.userId = $routeParams.duid;

            vm.navLogout = navLogout;
            vm.navHome = navHome;



            function navHome() {
                var userId = $routeParams.duid;
                var url = '/dashboard/'+userId+ '/dashboard-home';
                $location.url(url);
            }

            function navLogout() {
                if ($scope.logged) {
                    Facebook.logout(function () {
                        $scope.$apply(function () {
                            $scope.user = {};
                            $scope.logged = false;
                            $location.url('/');
                        });
                    });
                } else {
                    $location.url('/');
                }
            }


        }]);
})();
