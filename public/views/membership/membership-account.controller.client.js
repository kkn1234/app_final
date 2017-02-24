'use strict';
(function () {
    var app = angular.module('studiobuzz');

    app.controller('MembershipAccountController', ['$routeParams','MembershipUserService',
        '$location', function ($routeParams, MembershipUserService, $location) {
            var vm = this;
            vm.error = false;
            vm.isBusy = false;
            vm.addAccountInfo = addAccountInfo;
            vm.cancelAccountInfo = cancelAccountInfo;
            var userId = $routeParams.duid;

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

