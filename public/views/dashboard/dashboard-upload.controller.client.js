'use strict';

(function () {
    var app = angular.module('studiobuzz');

    app.controller('DashboardUploadContoller', ['$routeParams', '$location', '$scope', 'WizardHandler',
        'MovieService', '$interval', '$timeout',
        function ($routeParams, $location, $scope, WizardHandler, MovieService, $interval, $timeout) {
            var vm = this;
            vm.userId = $routeParams.duid;
            vm.changeLabelAndGoNext = changeLabelAndGoNext;
            vm.finishedWizard = finishedWizard;

            function changeLabelAndGoNext() {
                WizardHandler.wizard().next();
            }

            function finishedWizard() {
                vm.publishTab = true;
                console.log('finished');
            }

            //Movie detail
            vm.saveMovieInfoDisable = true;
            vm.error = false;
            vm.spinMsg = false;
            //function
            vm.movieinfo = movieinfo;

            function movieinfo(movie) {
                vm.spinMsg = true;
                console.log(movie);
                var movie = MovieService.createMovie(movie).then(function (result) {
                    var movie = result.data;
                    vm.movieId = movie._id;
                    vm.saveMovieInfoDisable = false;
                    vm.spinMsg = false;
                    console.log([movie, vm.movieId]);
                }, function (err) {
                    vm.error = true;
                });
            }


        //Image upload
        //Thumbnail upload
            vm.thumbnailimgUploadbtn = true;
            vm.thumbnailFileDisable = false;
            vm.successThumbUploadMsg = false;
            vm.failureThumbUploadMsg = false;
            vm.displayThumbImageProgress = false;
            vm.UploadThumbImgProgressVal = 0;
            //function
            vm.uploadThumbnailImg = uploadThumbnailImg;
            var UploadThumbImgComplete = UploadThumbImgComplete;
            //watcher
            $scope.$watch(function () {
                return vm.UploadThumbImgProgressVal;
            }, function () {
                var percentage = vm.UploadThumbImgProgressVal;
                if(percentage === 100){
                    console.log('Percentage 100 in watcher');
                    $timeout(function() {
                        // the code you want to run in the next digest
                        $scope.$apply(function () {
                            UploadThumbImgComplete();
                        });
                    });
                }
            });


            function UploadThumbImgComplete() {
                if (angular.isDefined(vm.Progress)) {
                    vm.failureThumbUploadMsg = false;
                    vm.thumbnailFileDisable = true;
                    vm.thumbnailimgUploadbtn = false;
                    vm.successThumbUploadMsg = true;
                    $interval.cancel(vm.Progress);
                    console.log('percentage interval call cancel');
                }
            }

            //    thumbnail upload progress
            var thumbnailProgress = function () {
                vm.displayThumbImageProgress = true;
                vm.Progress = $interval(getThumbnailProgress, 1000);
            };

            var getThumbnailProgress = function () {
                MovieService.getThumbnailUploadProgress().then(function (res) {
                    vm.UploadThumbImgProgressVal = res.data.percentage;
                    console.log('percentage interval call');
                    if(res.data.percentage === 100){
                        $interval.cancel(vm.Progress);
                    }
                }, function (err) {
                    $interval.cancel(vm.Progress);
                });
            };

            function uploadThumbnailImg(file) {
                console.log(file);
                if(file !== null && file !== undefined){
                    vm.failureThumbUploadMsg = false;
                    thumbnailProgress();
                    var promise = MovieService.uploadThumbnailimage(file, vm.movieId).then(function (res) {
                        console.log(res);
                        vm.thumbnailFileDisable = true;
                        vm.thumbnailimgUploadbtn = false;
                    }, function (err) {
                        vm.failureThumbUploadMsg = true;
                        vm.uploadImgerror = 'Upload failed! Reconnecting again';
                        vm.displayThumbImageProgress = false;
                        vm.thumbnailFileDisable = false;
                        vm.thumbnailimgUploadbtn = true;
                        vm.successThumbUploadMsg = false;
                    });

                }else {
                    vm.failureThumbUploadMsg = true;
                    vm.uploadImgerror = 'Please select file';
                }
            }





            //Cover upload
            vm.imgUploadNext = false;
            vm.coverImgUploadbtn = true;
            vm.coverFileDisable = false;
            vm.successCoverUploadMsg = false;
            vm.failureCoverUploadMsg = false;
            vm.displayCoverImageProgress = false;
            vm.UploadCoverImgProgressVal = 0;
            //function
            vm.uploadCoverImg = uploadCoverImg;
            var uploadCoverImgComplete = uploadCoverImgComplete;
            //watcher
            $scope.$watch(function () {
                return vm.UploadCoverImgProgressVal;
            }, function () {
                var percentage = vm.UploadCoverImgProgressVal;
                if(percentage === 100){
                    console.log('Percentage 100 in watcher');
                    $timeout(function() {
                        // the code you want to run in the next digest
                        $scope.$apply(function () {
                            uploadCoverImgComplete();
                        });
                    });
                }
            });


            function uploadCoverImgComplete() {
                if (angular.isDefined(vm.Progress)) {
                    vm.failureCoverUploadMsg = false;
                    vm.coverFileDisable = true;
                    vm.coverImgUploadbtn = false;
                    vm.successCoverUploadMsg = true;
                    $interval.cancel(vm.coverProgress);
                    console.log('percentage interval call cancel');
                }
            }

            //    cover upload progress
            var coverProgress = function () {
                vm.displayCoverImageProgress = true;
                vm.coverProgress = $interval(getCoverUploadProgress, 1000);
            };

            var getCoverUploadProgress = function () {
                MovieService.getCoverUploadProgress().then(function (res) {
                    vm.UploadCoverImgProgressVal = res.data.percentage;
                    console.log([res.data.percentage, 'cover per'])
                    if(res.data.percentage === 100){
                        $interval.cancel(vm.coverProgress);
                        vm.failureCoverUploadMsg = false;
                        vm.coverFileDisable = true;
                        vm.coverImgUploadbtn = false;
                        vm.successCoverUploadMsg = true;
                        vm.imgUploadNext = true;
                    }
                }, function (err) {
                    $interval.cancel(vm.coverProgress);
                });
            };


            function uploadCoverImg(file) {
                console.log(file);
                if(file !== null && file !== undefined){
                    vm.failureCoverUploadMsg = false;
                    coverProgress();
                    var promise = MovieService.uploadCoverimage(file, vm.movieId).then(function (res) {
                        console.log(res);
                        vm.coverFileDisable = true;
                        vm.coverImgUploadbtn = false;
                    }, function (err) {
                        vm.failureCoverUploadMsg = true;
                        vm.uploadImgerror = 'Upload failed! Reconnecting again';
                        vm.displayCoverImageProgress = false;
                        vm.coverFileDisable = false;
                        vm.coverImgUploadbtn = true;
                        vm.successCoverUploadMsg = false;
                    });

                }else {
                    vm.failureCoverUploadMsg = true;
                    vm.uploadImgerror = 'Please select file';
                }
            }



        //video upload
            vm.failureVideoUploadMsg = false;
            vm.videoFileDisable = false;
            vm.displayVideoProgress = false;
            vm.successVideoUploadMsg = false;
            vm.UploadVideoProgressVal = 0;
            vm.videoUploadbtn = true;
            vm.videoUploadNext = false;

            //function
            var uploadVideoComplete = uploadVideoComplete;
            //watcher
            $scope.$watch(function () {
                return vm.UploadVideoProgressVal;
            }, function () {
                var percentage = vm.UploadVideoProgressVal;
                if(percentage === 100){
                    console.log('Percentage 100 in watcher');
                    $timeout(function() {
                        // the code you want to run in the next digest
                        $scope.$apply(function () {
                            uploadVideoComplete();
                        });
                    });
                }
            });


            function uploadVideoComplete() {
                if (angular.isDefined(vm.videoProgress)) {
                    vm.failureVideoUploadMsg = false;
                    vm.displayVideoProgress = true;
                    vm.videoFileDisable = true;
                    vm.videoUploadbtn = false;
                    vm.successVideoUploadMsg = true;
                    vm.videoUploadNext = true;
                    $interval.cancel(vm.videoProgress);
                    console.log('percentage interval call cancel');
                }
            }

            //Video upload progress
            var videoProgress = function () {
                vm.displayVideoProgress = true;
                vm.videoProgress = $interval(getVideoProgress, 5000);
            };

            var getVideoProgress = function () {
                MovieService.getVideoUploadProgress().then(function (res) {
                    vm.UploadVideoProgressVal = res.data.percentage;
                    console.log([vm.UploadVideoProgressVal, 'upload perce']);
                    if(vm.UploadVideoProgressVal === 100){
                        vm.successVideoUploadMsg = true;
                        vm.videoUploadbtn = false;
                        vm.videoFileDisable = true;
                        vm.displayVideoProgress = true;
                        $interval.cancel(vm.videoProgress);
                        vm.videoUploadNext = true;
                    }
                    console.log(vm.UploadVideoProgressVal);

                }, function (err) {
                    $interval.cancel(vm.videoProgress);
                });
            };


            vm.uploadVideo = function (file) {
                if(file !== null && file !== undefined){
                    videoProgress();
                    vm.failureVideoUploadMsg = false;
                    var promise = MovieService.uploadVideo(file, vm.movieId).then(function (res) {
                        console.log(res);
                        vm.videoFileDisable = true;
                        vm.videoUploadbtn = false;
                    }, function (err) {
                        vm.successVideoUploadMsg = false;
                        vm.videoUploadbtn = true;
                        vm.videoUploadNext = false;
                        vm.failureVideoUploadMsg = true;
                        vm.uploadVideorerror = 'Upload failed! Please try again';
                        vm.videoFileDisable = false;
                    });
                }else {
                    vm.videoFileDisable = false;
                    vm.successVideoUploadMsg = false;
                    vm.failureVideoUploadMsg = true;
                    vm.videoUploadbtn = true;
                    vm.videoUploadNext = false;
                    vm.uploadVideorerror = 'Please select file';
                    $interval.cancel(vm.videoProgress);
                }
            };


        //    Advertise
            vm.adBtn = true;
            vm.adBtnNext = false;
            vm.successAdUploadMsg = false;

            vm.videoPromotion = function (promotion) {
                var ad = MovieService.createAdvertise(promotion, vm.movieId).then(function (result) {
                    vm.adBtn = false;
                    vm.successAdUploadMsg = true;
                    vm.adBtnNext = true;
                }, function (err) {
                    vm.adBtn = false;
                    vm.successAdUploadMsg = true;
                    vm.adBtnNext = true;
                });
            };

            vm.videoCancelPromotion = function () {
                var promotion = {
                    featuredlistAd: 'No',landingpageAd: 'No',coverAd: 'No'
                };
                var ad = MovieService.createAdvertise(promotion, vm.movieId).then(function (result) {
                    vm.adBtn = false;
                    vm.successAdUploadMsg = true;
                    vm.adBtnNext = true;
                }, function (err) {
                    vm.adBtn = false;
                    vm.successAdUploadMsg = true;
                    vm.adBtnNext = true;
                });
            };

        //    Publish
            vm.publishTab = false;
            vm.publishVideo = function () {
                var userId = $routeParams.duid;
                MovieService.publishVideo(userId, vm.movieId).then(function (res) {
                    console.log([res, 'pushing ref id to uid']);
                    WizardHandler.wizard().next();
                }, function (err) {
                    WizardHandler.wizard().next();
                });
            }



        }]);
})();
