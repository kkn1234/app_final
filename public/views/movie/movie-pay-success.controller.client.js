'use strict';

(function () {
    var app = angular.module('studiobuzz');

    app.controller('MoviePaySuccessController', ['$routeParams', 'PaymentService','$location','MovieService', '$scope', 'ezfb',
        function ($routeParams, PaymentService, $location, MovieService, $scope, ezfb) {
            var vm = this;
            var payment_request_id = $routeParams.payment_request_id;
            var payment_id = $routeParams.payment_id;
            var userId = $routeParams.uid;
            var movieId = $routeParams.mid;
            vm.isLoggedIn = false;
            console.log('Redirect url');
            console.log([payment_request_id, payment_id]);
            vm.navMoviesList = navMoviesList;
            vm.navMoviesHome = navMoviesHome;
            vm.navMoviesLogout = navMoviesLogout;

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


            function navMoviesHome() {
                var url = '/user/'+userId+ '/home';
                $location.url(url);
            }

            function navMoviesList() {
                var url = '/user/'+userId+ '/home/movieslist';
                $location.url(url);
            }

            var getPayment = function () {
                var payment = PaymentService.getPaymentDetails(payment_request_id, payment_id).then(function (result) {
                    console.log(result);
                    var data = result.data;
                    var earning = {
                        earning: data.payment_request.amount-data.payment_request.payment.fees
                    };
                    console.log(data);
                    if(data.success){
                        var paymentDetails = {
                            earning: data.payment_request.amount-data.payment_request.payment.fees,
                            buyer_name:data.payment_request.payment.buyer_name,
                            buyer_email: data.payment_request.payment.buyer_email,
                            buyer_phone: data.payment_request.payment.buyer_phone,
                            status: data.payment_request.payment.status,
                            fees:data.payment_request.payment.fees,
                            unit_price:data.payment_request.payment.unit_price,
                            payment_request_id:payment_request_id,
                            payment_id:payment_id,
                            userId: userId
                        };
                        console.log(paymentDetails);
                        if(data.payment_request.payment.status === 'Credit'){

                            PaymentService.createPaymentDetails(paymentDetails, movieId).then(function (result) {
                                console.log([result.data, 'created payment']);
                                var data = result.data;
                                var payId = data._id;
                                PaymentService.updatePaymentDetails(data, movieId).then(function (result) {
                                    console.log([result, 'update']);
                                    var url = '/user/'+userId+'/home/movie-pay/'+movieId+'/play/'+payId;
                                    $location.url(url);
                                }, function (err) {
                                    console.log(err);
                                });
                            }, function (err) {
                                console.log(err);
                            });
                        }else {
                            vm.payMsg = 'Payment failed. Please try again!.';
                        }

                    }
                }, function (err) {
                    console.log(err);
                });
            };

            if(payment_request_id !== undefined && payment_id !== undefined){
                vm.payMsg = 'SUCCESSFULL REDIRECT...';
                getPayment();
            }else {
                vm.payMsg = 'Payment failed. Please try again!.';
            }

            vm.MovieByList = function (movielist) {
                switch (movielist) {
                    case 'upcoming':
                        $location.url('/user/'+ userId +'/home/upcoming');
                        break;

                    case 'popular':
                        $location.url('/user/'+ userId +'/home/popular');
                        break;

                    case 'current':
                        $location.url('/user/'+ userId +'/home/currently-watching');
                        break;

                }

            };


        }]);
})();
