'use strict';

angular.module('app')
  .directive('pullToRefresh', function ($timeout) {
    return {
      restrict: 'A',
      transclude: true,
      template: '<div ng-class="pullToRefreshActive ? \'active\' : \'\' " ng-style="{\'top\' : toTop}" style="z-index:1;" class=" white circle z-depth-2 mj-loader-wrapper">' +
      '<div class="preloader-wrapper small active">' +
      '<div class="spinner-layer ">' +
      '<div class="circle-clipper left">' +
      '<div class="circle"></div>' +
      '</div>' +
      '<div class="gap-patch">' +
      '<div class="circle"></div>' +
      '</div>' +
      '<div class="circle-clipper right">' +
      '<div class="circle"></div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div><ng-transclude></ng-transclude>',
      scope: {
        refreshFunction: '&' // This function is expected to return a future
      },
      link: function postLink(scope, element, attrs) {
        scope.hasCallback = angular.isDefined(attrs.refreshFunction);
        scope.isAtTop = false;
        scope.pullToRefreshActive = false;
        scope.lastScrollTop = 0;

        var toTop = 30;
        var lastY;
        scope.toTop = toTop + 'px';

        var workingPromise;

        scope.pullToRefresh = function () {
          if (scope.hasCallback) {
            if (!workingPromise) {
              workingPromise = scope.refreshFunction()
                .then(function () {
                  scope.pullToRefreshActive = false;
                })
                .finally(function () {
                  workingPromise = null;
                });
            }
            scope.$digest();
          }
        };

        // Wait 1 second and then add an event listener to the scroll events on this list- this enables pull to refresh functionality
        $timeout(function () {
          var onScroll = function (event) {
            if (element[0].scrollTop <= 0 && scope.lastScrollTop <= 0) {
              if (event.touches) {
                if (!lastY) {
                  lastY = event.touches[0].screenY;
                }

                if (lastY <= event.touches[0].screenY) {
                  event.preventDefault();
                  scope.pullToRefreshActive = true;

                  toTop = toTop + 10;
                  if (toTop >= 150) {
                    toTop = 150;
                  }
                  scope.toTop = toTop + 'px';
                } else {
                  scope.pullToRefreshActive = false;

                  toTop = 30;
                  scope.toTop = toTop + 'px';
                }

                lastY = event.touches[0].screenY;
                scope.$apply();
              }

              // uncomment this line for desktop testing
              // if (element[0].scrollTop <= 0) {
              if (scope.isAtTop && toTop >= 150) {
                scope.pullToRefresh();
              } else {
                scope.isAtTop = true;
              }
            } else {
              scope.pullToRefreshActive = false;
            }
            scope.lastScrollTop = element[0].scrollTop;
          };
          element[0].addEventListener('scroll', onScroll);
          element[0].addEventListener('touchmove', onScroll);
        }, 1000);
      }
    };
  });
