angular
  .module('app')
  .controller('settingsCtrl', function ($rootScope, localUserService) {
    var vm = this;
    vm.user = {
      name: ''
    };

    $rootScope.headerTitle = 'Mon compte';

    localUserService.getUser()
      .then(function (user) {
        vm.user = user;
      });

    vm.updateName = function () {
      localUserService.updateName(vm.user.name);

      Smooch.updateUser({
        givenName: vm.user.name
      });
    };
  });
