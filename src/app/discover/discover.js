angular
  .module('app')
  .component('discover', {
    templateUrl: 'app/discover/discover.html',
    controller: DiscoverController,
    bindings: {
      activePan: '<'
    }
  });

/** @ngInject */
function DiscoverController($state, $rootScope, $q, $http, localUserService, filterService, merchantsService) {
  var vm = this;

  var init = function () {
    vm.lists = [];
    vm.isLoading = true;

    var query = filterService.getQuery();

    $http
      .get('https://mooj.herokuapp.com/lists')
      .then(function (response) {
        angular.forEach(response.data, function (data) {
          data.left = -10;
          vm.lists.push(data);
        });
      });

    merchantsService.getMerchants(query)
      .then(function (merchants) {
        vm.merchants = merchants;

        localUserService.getUser()
          .then(function (user) {
            vm.merchants.forEach(function (merchant) {
              if (merchant.followers) {
                merchant.followers.value.forEach(
                  function (follower) {
                    if (follower._id === user._id) {
                      merchant.followsAlready = true;
                    }
                  });
              }
            });

            vm.isLoading = false;
          });
      });
  };

  var getLabel = function () {
    vm.label = filterService.getLabel();
  };

  filterService.addListener(init);
  filterService.addListener(getLabel);

  vm.$onInit = function () {
    init();
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

  vm.refresh = function () {
    var deferred = $q.defer();

    var query = filterService.getQuery();

    merchantsService.getMerchants(query)
      .then(function (merchants) {
        vm.merchants = merchants;

        localUserService.getUser()
          .then(function (user) {
            vm.merchants.forEach(function (merchant) {
              if (merchant.followers) {
                merchant.followers.value.forEach(
                  function (follower) {
                    if (follower._id === user._id) {
                      merchant.followsAlready = true;
                    }
                  });
              }
            });

            deferred.resolve(true);
          });
      });
    return deferred.promise;
  };

  vm.actionFollow = function (merchant) {
    if (merchant.followsAlready) {
      vm.unfollowMerchant(merchant);
    } else {
      vm.followMerchant(merchant);
    }
  };

  vm.followMerchant = function (merchant) {
    localUserService
      .followMerchant(merchant)
      .then(function () {
        merchant.followers.totalCount++;
        merchant.followsAlready = true;
      });
  };

  vm.unfollowMerchant = function (merchant) {
    localUserService
      .unfollowMerchant(merchant)
      .then(function () {
        merchant.followers.totalCount--;
        merchant.followsAlready = false;
      });
  };

  vm.followList = function (list) {
    localUserService
      .followList(list)
      .then(function (response) {
        console.log(response);
      });
  };

  vm.browseMerchant = function (merchant) {
    if ($rootScope.swiping) {
      $rootScope.swiping = false;
    } else {
      $state.go('merchants', {id: merchant._id});
      $rootScope.activePan = merchant.pseudo;
    }
  };

  vm.swipeLeft = function (list) {
    list.left = list.left - 120;
    if (list.left < -370) {
      list.left = -10;
    }
  };

  vm.swipeRight = function (list) {
    list.left = list.left + 120;
    if (list.left > -10) {
      list.left = -370;
    }
  };
}

