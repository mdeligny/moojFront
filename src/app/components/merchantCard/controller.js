angular
  .module('app')
  .component('merchantCard', {
    templateUrl: 'app/components/merchantCard/template.html',
    controller: merchantController,
    controllerAs: 'vm',
    bindings: {
      merchant: '='
    }
  });


/** @ngInject */
function merchantController(localUserService, filterService) {
  var vm = this;

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

  vm.actionFollow = function (merchant) {
    if (merchant.followsAlready) {
      vm.unfollowMerchant(merchant);
    } else {
      vm.followMerchant(merchant);
    }
  };

  vm.selectLabel = function (label) {
    filterService.setLabel(label);
  };
}

