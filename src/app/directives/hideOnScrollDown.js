'use strict';

angular.module('app')

  .directive('hideOnScrollDown', function ($timeout, $rootScope) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var lastScroll = 0;
        var beforeLastScroll = 0;

        // Wait 1 second and then add an event listener to the scroll events on this list- this enables pull to refresh functionality
        $timeout(function () {
          var onScroll = function () {
            if (element[0].scrollTop >= lastScroll && lastScroll >= beforeLastScroll) {
              $rootScope.$broadcast('hideMenu');
            } else {
              $rootScope.$broadcast('showMenu');
            }

            beforeLastScroll = lastScroll;
            lastScroll = element[0].scrollTop;
          };
          element[0].addEventListener('scroll', onScroll);
          element[0].addEventListener('touchmove', onScroll);
        }, 1000);
      }
    };
  });
