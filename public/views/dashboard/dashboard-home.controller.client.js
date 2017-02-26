'use strict';

(function () {
    var app = angular.module('studiobuzz');

    app.controller('DashboardHomeContoller', ['$routeParams', 'MembershipUserService',
        '$scope', '$location', 'MovieService', 'ezfb',
        function ($routeParams, MembershipUserService, $scope, $location, MovieService, ezfb) {
            var vm = this;
            var userId = $routeParams.duid;
            vm.id = userId;

            vm.navHome = navHome;
            vm.navLogout = navLogout;
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
                var url = '/dashboard/'+userId+ '/dashboard-home';
                $location.url(url);
            }





            var user = MembershipUserService.findUserById(userId).then(function (result) {
                console.log(result);
                var movie = result.data.movie;
                var movieId = movie[0];
                console.log(movieId);
                var data = MovieService.findMovieById(movieId).then(function (res) {
                    vm.movieObj = res.data;
                    console.log([vm.movieObj, 'movie object']);
                }, function (err) {
                    console.log(err);
                });
            }, function (err) {
                console.log(err);
            });




        }]);
})();
