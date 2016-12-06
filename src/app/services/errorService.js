'use strict';

angular.module('app')
  .service('errorsService', function ($rootScope, $timeout, $window) {
    this.fireError = function (response) {
      if (response.status === -1) {
        $rootScope.$broadcast('loaded');
        $rootScope.$broadcast('notify', {
          title: 'Not connected',
          body: 'Please check your internet connection',
          type: 'error'
        });
      } else if (response.status !== 401) {
        $rootScope.$broadcast('notify', {
          title: 'Error' + response.status,
          body: response.statusText,
          type: 'error'
        });

        $timeout(function () {
          $window.open('#/', '_self');
        }, 2000);
      }
    };
  });
