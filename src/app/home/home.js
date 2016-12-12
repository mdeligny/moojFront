angular
  .module('app')
  .controller('homeCtrl', function ($rootScope, $scope, $http, $timeout) {
    Smooch.init({
      appToken: '4zv6lhj9ne5zdfrw9egxputmz',
      customText: {
        headerText: 'On peut vous aider?',
        inputPlaceholder: 'Ecrivez votre message',
        introductionText: 'Une question, une suggestion, un bug à signaler, nous sommes là pour vous',
        sendButtonText: 'Envoyer'
      }
    });
    var vm = this;

    vm.showMenu = true;

    $rootScope.$on('showMenu', function () {
      vm.showMenu = true;
      $scope.$apply();
    });

    $rootScope.$on('hideMenu', function () {
      vm.showMenu = false;
      $scope.$apply();
    });

    //$rootScope.activePan = $rootScope.activePan || 'around';

    vm.swipeMyMooj = function () {
      $rootScope.swiping = true;
      $timeout(function () {
        angular.element('ul.tabs').tabs('select_tab', 'mymooj');

        $rootScope.swiping = false;
      });
      vm.getMyMooj();
    };

    vm.swipeAround = function () {
      $rootScope.swiping = true;
      $timeout(function () {
        angular.element('ul.tabs').tabs('select_tab', 'autour');

        $rootScope.swiping = false;
      });
      vm.getAroundDeals();
    };

    vm.swipeDiscover = function () {
      $rootScope.swiping = true;
      $timeout(function () {
        angular.element('ul.tabs').tabs('select_tab', 'decouvrir');

        $rootScope.swiping = false;
      });
      vm.getDiscoverDeals();
    };

    vm.getMyMooj = function () {
      $rootScope.headerTitle = 'mes enseignes';
      $rootScope.activePan = 'mes enseignes';
    };
    vm.getAroundDeals = function () {
      $rootScope.headerTitle = 'autour de moi';
      $rootScope.activePan = 'autour de moi';
    };
    vm.getDiscoverDeals = function () {
      $rootScope.headerTitle = 'découvrir';
      $rootScope.activePan = 'découvrir';
    };

    var previousScroll = 0;
    angular.element('window').scroll(function () {
      var scroll = $(this).scrollTop();
      if (scroll > previousScroll) {
        // downscroll code
      } else {
        // upscroll code
      }
      previousScroll = scroll;
    });

    switch ($rootScope.activePan) {
      case 'mes enseignes':
        vm.swipeMyMooj();
        break;
      case 'découvrir':
        vm.swipeDiscover();
        break;
      case 'autour':
        vm.swipeAround();
        break;
      default:
        vm.getAroundDeals();
        break;
    }
  });
