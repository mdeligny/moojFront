angular
  .module('app')
  .controller('accountCtrl', function ($rootScope, $state, localUserService) {
    var vm = this;
    vm.user = {
      name: ''
    };

    $rootScope.headerTitle = 'Mes commerçants';

    localUserService.getUser()
      .then(function (user) {
        vm.user = user;
      });

    vm.swipeLeft = function (merchant) {
      merchant.isSwiped = true;
    };

    vm.swipeRight = function (merchant) {
      merchant.isSwiped = false;
    };

    vm.unfollowMerchant = function (index,merchant) {
      localUserService
        .unfollowMerchant(merchant)
        .then(function () {
          vm.user.following.splice(index,1);
        });
    };

    vm.browseMerchant = function (merchant) {
      $rootScope.headerTitle = merchant.pseudo;
      $state.go('merchants', {id: merchant._id});
    };
  });
