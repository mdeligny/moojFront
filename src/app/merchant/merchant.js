angular
  .module('app')
  .controller('merchantItemCtrl', function ($stateParams, $rootScope, $http, $scope, localUserService) {
    var vm = this;

    $rootScope.$broadcast('loading');
    vm.isLoadingMap = true;

    vm.followMerchant = function (merchant) {
      localUserService
        .followMerchant(merchant)
        .then(function (response) {
          vm.merchant.followers.totalCount++;
          vm.merchant.followsAlready = true;
        });
    };

    vm.unfollowMerchant = function (merchant) {
      localUserService
        .unfollowMerchant(merchant)
        .then(function (response) {
          vm.merchant.followers.totalCount--;
          vm.merchant.followsAlready = false;
        });
    };

    $http
      .get('https://mooj.herokuapp.com/merchants/' + $stateParams.id + '/deals?limit=5')
      .then(function (response) {

        var now = new Date();
        var deals = [];

        angular.forEach(response.data, function (deal) {
          var dealTime = new Date(deal.timestamp);

          var tmp = now - dealTime;

          var diff = {};                       // Initialisation du retour

          tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
          diff.sec = tmp % 60;                    // Extraction du nombre de secondes

          tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
          diff.min = tmp % 60;                    // Extraction du nombre de minutes

          tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
          diff.hour = tmp % 24;                   // Extraction du nombre d'heures

          tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
          diff.day = tmp;

          deal.date = (diff.hour >= 1 ? diff.hour + 'h ' : '') + diff.min + 'mn';

          /*
           * Demo fix : orderDate to push also old news
           * */
          deal.orderDate = (diff.hour < 10 ? '0' + diff.hour : diff.hour) + '' + (diff.min < 10 ? '0' + diff.min : diff.min);

          deals.push(deal);

        });

        // Demo fix : remove duplicates for date conflict purpos
        vm.lastDeals = _.uniqBy(deals, 'description');
      });

    $http
      .get('https://mooj.herokuapp.com/merchants/' + $stateParams.id)
      .then(function (response) {
        $rootScope.$broadcast('loaded');

        vm.merchant = response.data;

        localUserService.getUser().then(function (user) {
          vm.merchant.followers.value.forEach(function (follower) {
            if (follower._id === user._id) {
              vm.merchant.followsAlready = true;
            }
          });
        });

        navigator.geolocation.getCurrentPosition(function (location) {
          vm.initLat = location.coords.latitude;
          vm.initLong = location.coords.longitude;
          vm.lat = vm.merchant.location.coordinates[0] || location.coords.latitude;
          vm.long = vm.merchant.location.coordinates[1] || location.coords.longitude;

          $scope.$apply();
          vm.isLoadingMap = false;

        });
      });

  });
