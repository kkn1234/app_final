'use strict';

(function () {
    var app = angular.module('studiobuzz');

    app.controller('MoviePayController', ['MovieService', '$routeParams', '$sce','$window',
         '$scope','$location', 'PaymentService',
        function (MovieService, $routeParams, $sce,  $window, $scope, $location, PaymentService) {
            var vm = this;
            var userId = $routeParams.uid;
            var movieId = $routeParams.mid;
            vm.isBusy = false;
            var redirect_url = 'http://localhost:8080/#!/user/'+ userId+'/home/movie-pay/'+ movieId +'/pay-success';
            vm.navMoviesList = navMoviesList;
            vm.navMoviesHome = navMoviesHome;


            function navMoviesHome() {
                var url = '/user/'+userId+ '/home';
                $location.url(url);
            }

            function navMoviesList() {
                var url = '/user/'+userId+ '/home/movieslist';
                $location.url(url);
            }



            vm.playMovie = function (movie) {
                vm.isBusy = true;
                var data  = {
                    purpose: movie.title, amount: movie.price, redirect_url:redirect_url
                };
                var payment = PaymentService.makePayment(data).then(function (result) {
                    console.log(result.data);
                    var payment = result.data;
                    if(payment.success){
                        console.log([payment.success, payment.payment_request]);
                        $window.location.href = payment.payment_request.longurl;
                    }else {
                        console.log('payment.success is failed');
                    }

                }, function (err) {
                    console.log(err);
                });
            };


            var movie = MovieService.findMovieById(movieId).then(function (movie) {
                vm.movie = movie.data;
                // var src = 'https://dpwrg5f5s7hgb.cloudfront.net/sample.mp4';
                var src ='';
                vm.image = vm.movie.cloudThumbUrl;
                vm.config = {
                    preload: "none",
                    sources: [
                        {src: $sce.trustAsResourceUrl(src), type: "video/mp4"},
                        {src: $sce.trustAsResourceUrl(src), type: "video/webm"},
                        {src: $sce.trustAsResourceUrl(src), type: "video/ogg"}
                    ],
                    theme: {
                        url: "../../css/videogular.css"
                    },

                    plugins: {
                        posterImage: vm.movie.coverUrl,
                        controls: {
                            autoHide: true,
                            autoHideTime: 5000
                        }
                    }
                };

            }, function (err) {
                console.log(err);
            });

        }]);
})();

