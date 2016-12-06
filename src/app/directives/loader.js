'use strict';
/**
 * Created by martindeligny1 on 12/10/15.
 */

angular.module('app')

  .controller('loaderController', function ($scope) {
    var vm = this;

    function resetLoader() {
      vm.loading = false;
    }

    resetLoader();

    $scope.$on('loading', function () {
      vm.loading = true;
    });

    $scope.$on('loaded', function () {
      resetLoader();
    });
  })

  .directive('moojLoader', function () {
    return {
      rescrict: 'E',
      replace: true,
      scope: {},
      controller: 'loaderController',
      controllerAs: 'vm',
      templateUrl: 'app/directives/loader.html'
    };
  })
;
