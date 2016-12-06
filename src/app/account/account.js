angular
  .module('app')
  .controller('accountCtrl', function ($rootScope, $state, localUserService) {
    var vm = this;
    vm.user = {
      name: ''
    };

    $rootScope.activePan = 'Mon compte';

    localUserService.getUser()
      .then(function (user) {
        vm.user = user;
      });

    vm.browseMerchant = function (merchant) {
      $rootScope.activePan = merchant.pseudo;
      $state.go('merchants', {id: merchant._id});
    };
  });
