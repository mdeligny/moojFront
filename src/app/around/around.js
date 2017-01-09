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
function AroundController($state, $http, $rootScope, filterService, dealsService) {
  var vm = this;

  var init = function () {
    vm.errorMessage = "";
    vm.isLoading = true;

    var userLocation = filterService.getLocation();

    if (userLocation) {
      var query = 'location=' + userLocation + '&' + filterService.getQuery();

      dealsService.getDeals(query)
        .then(function (deals) {
          vm.isLoading = false;

          vm.deals = deals;

          if (deals.length > 0 && !vm.cityText) {
            vm.cityText = deals[0].merchant.city;
          } else {
            vm.errorMessage = "Malheureusement, il n'y a aucune annonce dans votre entourage ...";
          }
        }, function () {
          vm.errorMessage = "Erreur lors de la récupération des deals :(";
        });
    } else {
      vm.localizeMe();
    }
  };

  vm.localizeMe = function () {
    vm.errorMessage = "";
    vm.editCity = false;
    vm.cityText = '';
    vm.newCity = '';
    vm.isLoading = true;
    navigator.geolocation.getCurrentPosition(
      function (location) {
        var lat = location.coords.latitude;
        var lng = location.coords.longitude;

        filterService.setLocation(lat + ',' + lng);

        var query = 'location=' + filterService.getLocation() + '&' + filterService.getQuery();

        dealsService.getDeals(query)
          .then(function (deals) {
            vm.isLoading = false;

            vm.deals = deals;

            if (deals.length > 0) {
              vm.cityText = deals[0].merchant.city;
            }
            else {
              vm.errorMessage = "Malheureusement, il n'y a aucune annonce autour de vous ...";
            }
          }, function () {
            vm.errorMessage = "Erreur lors de la récupération des deals :(";
          });
      },
      function () {
        vm.errorMessage = "Veuillez activer la geolocalisation pour bénéficier pleinement du service.";
        vm.isLoading = false;
        vm.deals = [];
      }
    );
  };

  vm.browseMerchant = function (merchant) {
    if ($rootScope.swiping) {
      $rootScope.swiping = false;
    } else {
      $rootScope.headerTitle = merchant.pseudo;
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
    vm.errorMessage = "";
    var query = 'location=' + filterService.getLocation() + '&' + filterService.getQuery();

    return dealsService.getDeals(query)
      .then(function (deals) {
        vm.isLoading = false;

        vm.deals = deals;
      }, function () {
        vm.errorMessage = "Erreur lors de la récupération des deals :(";
      });
  };

  vm.changeCity = function (cityName) {
    vm.isLoading = true;
    vm.errorMessage = "";

    $http
      .get('https://maps.googleapis.com/maps/api/geocode/json?address=' + cityName + '&key=AIzaSyC0NG1mGANovrnoM4Xx40ujcpal_kkPhrM')
      .then(function (response) {
        if (response.data.results && response.data.results.length > 0) {
          vm.editCity = false;
          var location = response.data.results[0].geometry.location.lat + ',' + response.data.results[0].geometry.location.lng;

          filterService.setLocation(location);

          var query = 'location=' + filterService.getLocation() + '&' + filterService.getQuery();

          dealsService.getDeals(query)
            .then(function (deals) {

              vm.deals = deals;
              vm.isLoading = false;

              if (deals.length > 0 && !vm.cityText) {
                vm.cityText = deals[0].merchant.city;
              } else {
                vm.errorMessage = "Malheureusement, il n'y a aucune annonce autour de vous ...";
              }

            }, function () {
              vm.errorMessage = "Erreur lors de la récupération des deals :(";
            });
        } else {
          vm.cityText = cityName;
          vm.isLoading = false;
          filterService.setLocation('');
          vm.editCity = true;
          vm.deals = [];
          vm.errorMessage = "Erreur lors de la localisation...";
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
