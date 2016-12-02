angular
  .module('app')
  .component('around', {
    templateUrl: 'app/around/around.html',
    controller: AroundController,
    bindings: {
      activePan: '<'
    }
  });

/** @ngInject */
function AroundController($state, $http, $q, $rootScope, filterService, dealsService) {
  var vm = this;

  var init = function () {
    vm.isLoading = true;
    navigator.geolocation.getCurrentPosition(function (location) {
        var lat = location.coords.latitude;
        var lng = location.coords.longitude;

        var query = 'location=' + lat + ',' + lng + '&' + filterService.getQuery();

        dealsService.getDeals(query)
          .then(function (deals) {
            vm.isLoading = false;

            vm.deals = deals;

            if (deals.length > 0) {
              vm.cityText = deals[0].merchant.city;
            }
          });
      }
    );
  };

  vm.browseMerchant = function (merchant) {
    if ($rootScope.swiping) {
      $rootScope.swiping = false;
    }
    else {
      $rootScope.activePan = merchant.pseudo;
      $state.go('merchants', {id: merchant._id});
    }
  };

  vm.$onInit = function () {
    init();
  };

  var getLabel = function () {
    vm.label = filterService.getLabel();
  };

  filterService.addListener(init);
  filterService.addListener(getLabel);

  vm.refresh = function () {
    var deferred = $q.defer();

    navigator.geolocation.getCurrentPosition(function (location) {
        var lat = location.coords.latitude;
        var lng = location.coords.longitude;

        var query = 'location=' + lat + ',' + lng + '&' + filterService.getQuery();

        dealsService.getDeals(query)
          .then(function (deals) {
            vm.deals = deals;

            if (deals.length > 0) {
              vm.cityText = deals[0].merchant.city;
            }
            deferred.resolve(true);
          });
      }
    );
    return deferred.promise;

  };

  vm.changeCity = function (cityName) {
    vm.cityText = cityName;

    $http
      .get('https://maps.googleapis.com/maps/api/geocode/json?address=' + cityName + '&key=AIzaSyC0NG1mGANovrnoM4Xx40ujcpal_kkPhrM')
      .then(function (response) {
        if (response.data.results && response.data.results.length > 0) {
          vm.editCity = false;
          var location = response.data.results[0].geometry.location.lat + ',' + response.data.results[0].geometry.location.lng;

          var query = 'location=' + location + '&' + filterService.getQuery();

          dealsService.getDeals(query)
            .then(function (deals) {
              vm.deals = deals;
            });
        }
        else {
          vm.editCity = true;
          vm.deals = [];
        }
      });
  };


  vm.selectLabel = function (label) {
    filterService.setLabel(label);
  };

  vm.removeLabel = function (label) {
    filterService.removeLabel(label);
  };

  vm.resetLabels = function () {
    angular.forEach(vm.label, function (label) {
      filterService.removeLabel(label);
    });
  };


}
