angular
  .module('app')
  .controller('listCtrl', function ($stateParams, $rootScope, $http, $state) {
    var vm = this;

    $rootScope.$broadcast('loading');

    $http
      .get('https://mooj.herokuapp.com/lists/' + $stateParams.id)
      .then(function (response) {

        console.log(response);

        vm.list = response.data;

        $rootScope.headerTitle = vm.list.name;
        $rootScope.$broadcast('loaded');

      });


    vm.browseMerchant = function (merchant) {
      $state.go('merchants', {id: merchant._id});
      $rootScope.headerTitle = merchant.pseudo;
    };
  });
