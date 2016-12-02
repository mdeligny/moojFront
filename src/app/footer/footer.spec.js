describe('footer component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('moojFooter', function () {
      return {
        templateUrl: 'app/footer/footer.html'
      };
    });
  }));
  it('should render \'FountainJS team\'', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<fountain-footer></fountain-footer>')($rootScope);
    $rootScope.$digest();
    var footer = element.find('a');
    expect(footer.html().trim()).toEqual('FountainJS team');
  }));
});
