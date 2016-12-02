angular
  .module('app')
  .component('merchantsList', {
    templateUrl: 'app/merchants/merchants.html',
    controller: MerchantsController
  });

/** @ngInject */
function MerchantsController($http) {
  var vm = this;

  $http
    .get('https://mooj.herokuapp.com/merchants')
    .then(function (response) {
      console.log(response.data);
      vm.merchants = response.data;
    });
}
