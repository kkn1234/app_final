'use strict';

(function () {
    var app = angular.module('studiobuzz');

    app.controller('DashboardHomeContoller', ['$routeParams', 'MembershipUserService',
        '$scope', '$location', 'MovieService',
        function ($routeParams, MembershipUserService, $scope, $location, MovieService) {
            var vm = this;
            var userId = $routeParams.duid;
            vm.id = userId;

            vm.navLogout = navLogout;
            vm.navHome = navHome;



            function navHome() {
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
