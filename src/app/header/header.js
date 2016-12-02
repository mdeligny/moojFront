angular
  .module('app')
  .component('moojHeader', {
    templateUrl: 'app/header/header.html',
    controller: HeaderController
  });

/** @ngInject */
function HeaderController($rootScope, $scope, $http, filterService) {
  var vm = this;
  vm.showMenu = true;

  $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    vm.previousState = from.url;
    vm.isHomePage = to.url === '/';
    if(!vm.isHomePage) {
      vm.showMenu = true;
    }
  });

  $rootScope.$watch('activePan', function (n) {
    vm.activePan = n;
  });

  $rootScope.$on('showMenu', function () {
    vm.showMenu = true;
    $scope.$apply();
  });

  $rootScope.$on('hideMenu', function () {
    vm.showMenu = false;
    $scope.$apply();
  });

  $http.get('https://mooj.herokuapp.com/macrocategories')
    .then(function (response) {

      vm.categories = response.data;
    });

  vm.setFilter = function (category) {

    var labels = category.categories.map(function (label) {
      return label._id;
    });

    if (category.isActive) {
      filterService.removeCategory(labels.join());
    }
    else {
      filterService.addCategory(labels.join());
    }
    category.isActive = !category.isActive || false;

  };

  vm.resetFilter = function () {
    angular.forEach(vm.categories, function (category) {
      category.isActive = false;
      category.isDeployed = false;
    });
    filterService.resetFilter();
  };

  vm.deployCategory = function (category) {
    category.isDeployed = !category.isDeployed || false;
  };

  var activeLabels = [];

  var getActiveLabels = function () {
    activeLabels = filterService.getLabel();

    angular.forEach(vm.categories, function (category) {
      angular.forEach(category.categories, function (label) {

        label.isActive = _.filter(activeLabels, function (activeLabel) {
            return activeLabel._id === label._id;
          }).length !== 0;

      });
    });
  };

  filterService.addListener(getActiveLabels);

  vm.selectLabel = function (label) {
    if (label.isActive) {
      activeLabels = [];
      filterService.removeLabel(label);
    }
    else {
      activeLabels = [label];
      filterService.setLabel(label);
    }

  };
}
