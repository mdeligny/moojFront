angular
  .module('app')
  .component('deals', {
    templateUrl: 'app/deals/deals.html',
    controller: DealsController,
    bindings: {
      activePan: '<'
    }
  });

/** @ngInject */
function DealsController($rootScope, $state, $q, filterService, dealsService) {
  var vm = this;

  var getLabel = function () {
    vm.label = filterService.getLabel();
  };

  var init = function () {
    vm.isLoading = true;

    var query = filterService.getQuery();

    dealsService.getMyMooj(query)
      .then(function (deals) {
        vm.deals = deals;
        vm.isLoading = false;
      });
  };

  filterService.addListener(init);
  filterService.addListener(getLabel);

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

  vm.browseMerchant = function (merchant) {
    if ($rootScope.swiping) {
      $rootScope.swiping = false;
    } else {
      $state.go('merchants', {id: merchant._id});
      $rootScope.headerTitle = merchant.pseudo;
    }
  };

  vm.$onInit = function () {
    init();
  };

  vm.refresh = function () {
    var deferred = $q.defer();

    var query = filterService.getQuery();

    dealsService.getMyMooj(query)
      .then(function (deals) {
        vm.deals = deals;
        deferred.resolve(true);
      });
    return deferred.promise;
  };
}
