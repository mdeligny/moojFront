angular
  .module('app')
  .component('dealCard', {
    templateUrl: 'app/components/dealCard/template.html',
    controller: dealCardController,
    controllerAs: 'vm',
    bindings: {
      deal: '='
    }
  });


/** @ngInject */
function dealCardController(filterService) {
  var vm = this;

  vm.selectLabel = function (label) {
    filterService.setLabel(label);
  };
}

