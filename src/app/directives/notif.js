'use strict';
/**
 * Created by martindeligny1 on 12/10/15.
 */

angular.module('app')
  .controller('notifCtrl', function ($scope, $timeout) {
    var vm = this;
    vm.showNotification = false;

    $scope.$on('notify', function (event, notification) {
      vm.title = notification.title;
      vm.body = notification.body;
      vm.type = notification.type;
      vm.showNotification = true;

      $timeout(function () {
        vm.showNotification = false;
      }, 3000);
    });
  })

  .directive('moojNotif', function () {
    return {
      controller: 'notifCtrl',
      controllerAs: 'vm',
      scope: {},
      bindToController: true,
      rescrict: 'E',
      template: '<div style="position:fixed;z-index:999999999999;width:300px;" ng-class="vm.showNotification ? \'active\' : \'\' " class="notif-container card">' +
      '<div class="card-content white">' +
      '<span class="card-title" ng-class="vm.type === \'error\' ? \'red-text\' : \'green-text\' ">{{vm.title}}</span>' +
      '<p class="black-text" ng-bind="vm.body"></p>' +
      '</div>' +
      '</div>'
    };
  });
