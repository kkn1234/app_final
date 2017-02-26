'use strict';

(function () {
    var app = angular.module('studiobuzz');

    app.controller('DashboardReportContoller', [ '$routeParams','MembershipUserService', '$location', '$scope', 'MovieService', 'ezfb',
        function ($routeParams, MembershipUserService, $location, $scope, MovieService, ezfb) {
            var vm = this;
            vm.userId = $routeParams.duid;
            vm.navLogout = navLogout;
            vm.navHome = navHome;


            function navHome() {
                var userId = $routeParams.duid;
                var url = '/dashboard/'+userId+ '/dashboard-home';
                $location.url(url);
            }

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



            var user = MembershipUserService.findUserById(vm.userId).then(function (result) {
                console.log(result);
                var movie = result.data.movie;
                var movieId = movie[0];
                console.log(movieId);

                var data = MovieService.findMovieById(movieId).then(function (res) {
                    vm.movieObj = res.data;
                    vm.movies = [vm.movieObj];
                }, function (err) {
                    console.log(err);
                });
            }, function (err) {
                console.log(err);
            });



        }]);
})();
