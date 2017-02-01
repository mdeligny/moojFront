angular
  .module('app')
  .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|tel|mailto|sms):/);
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/home/home.html',
      controller: 'homeCtrl',
      controllerAs: 'vm'
    })
    .state('newMerchant', {
      url: '/merchants/new',
      templateUrl: 'app/merchant/newMerchant.html',
      controller: 'newMerchantItemCtrl',
      controllerAs: 'vm'
    })
    .state('merchants', {
      url: '/merchants/:id',
      templateUrl: 'app/merchant/merchant.html',
      controller: 'merchantItemCtrl',
      controllerAs: 'vm'
    })
    .state('lists', {
      url: '/lists/:id',
      templateUrl: 'app/list/list.html',
      controller: 'listCtrl',
      controllerAs: 'vm'
    })
    .state('settings', {
      url: '/settings',
      templateUrl: 'app/settings/settings.html',
      controller: 'settingsCtrl',
      controllerAs: 'vm'
    })
    .state('about', {
      url: '/about',
      templateUrl: 'app/about/about.html',
      controller: 'aboutCtrl',
      controllerAs: 'vm'
    })
    .state('account', {
      url: '/account',
      templateUrl: 'app/account/account.html',
      controller: 'accountCtrl',
      controllerAs: 'vm'
    });
}
