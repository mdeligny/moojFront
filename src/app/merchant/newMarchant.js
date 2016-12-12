angular
  .module('app')
  .controller('newMerchantItemCtrl', function ($stateParams, $q, $rootScope, $http, $scope, errorsService) {
    var vm = this;
    var newImages = [];

    $rootScope.headerTitle = 'Nouveau commerçant';

    $http.get('https://mooj.herokuapp.com/categories').then(function (response) {
      vm.categories = response.data;
    });

    $scope.$watch('vm.imagesForm', function (element) {
      if (element !== undefined) {
        angular.forEach(vm.imagesForm, function (file) {
          newImages.push(file);
        });
      }
    });

    vm.newMerchant = {
      adress: '',
      city: ''
    };

    function localizeUser() {
      return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + vm.newMerchant.adress + ',' + vm.newMerchant.city + '&key=AIzaSyC0NG1mGANovrnoM4Xx40ujcpal_kkPhrM')
        .then(function (data) {
          return data.data.results.length > 0 ? data.data.results[0].geometry.location : {lat: "", lng: ""};
        });
    }

    vm.addNewMerchant = function () {
      $rootScope.$broadcast('loading');
      var uploadPromise;

      if (newImages.length > 0) {
        var formData = new FormData();
        formData.append('file', newImages[0]);

        uploadPromise = $http.post('https://mooj.herokuapp.com/upload', formData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        }).then(function (data) {
          return data.data.secure_url;
        }, function () {
          return '';
        });
      } else {
        uploadPromise = $q.resolve('');
      }

      uploadPromise
        .then(function (imageLink) {
          localizeUser()
            .then(function (coordonnes) {
              var merchant = {};

              merchant.name = vm.newMerchant.name;
              merchant.pseudo = vm.newMerchant.pseudo;
              merchant.category = vm.newMerchant.category.map(function (category) {
                return category._id;
              });
              merchant.phone = vm.newMerchant.phone;
              merchant.email = vm.newMerchant.email;
              merchant.adress = vm.newMerchant.adress;
              merchant.city = vm.newMerchant.city;
              merchant.location = [coordonnes.lat, coordonnes.lng];
              merchant.moojPhone = vm.newMerchant.moojPhone;
              merchant.moojMail = vm.newMerchant.moojMail;
              merchant.imageLink = imageLink;

              $http.post('https://mooj.herokuapp.com/merchants', merchant)
                .then(function () {
                  $rootScope.$broadcast('loaded');

                  vm.newMerchant = {
                    name: '',
                    pseudo: '',
                    catetory: '',
                    phone: '',
                    email: '',
                    adress: '',
                    city: '',
                    moojPhone: '',
                    moojMail: ''
                  };

                  $rootScope.$broadcast('notify', {
                    title: 'Succès',
                    body: 'Commerçant ajouté'
                  });
                }, function (err) {
                  $rootScope.$broadcast('loaded');

                  errorsService.fireError(err);
                });
            }, function (err) {
              $rootScope.$broadcast('loaded');

              errorsService.fireError(err);
            });
        }, function (err) {
          $rootScope.$broadcast('loaded');

          errorsService.fireError(err);
        });
    };
  })
  .directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files);
          });
        });
      }
    };
  }]);
