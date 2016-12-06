'use strict';

angular.module('app')
  .service('dealsService', function ($rootScope, $http, localUserService) {
    this.getDeals = function (query) {
      return $http
        .get('https://mooj.herokuapp.com/deals?' + query)
        .then(function (response) {
          var now = new Date();
          var deals = [];

          angular.forEach(response.data, function (deal) {
            var dealTime = new Date(deal.time.raw);

            var tmp = now - dealTime;

            var diff = {};                       // Initialisation du retour

            tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
            diff.sec = tmp % 60;                    // Extraction du nombre de secondes

            tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
            diff.min = tmp % 60;                    // Extraction du nombre de minutes

            tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
            diff.hour = tmp % 24;                   // Extraction du nombre d'heures

            tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
            diff.day = tmp;

            deal.date = (diff.hour >= 1 ? diff.hour + 'h ' : '') + diff.min + 'mn';

            /*
             * Demo fix : orderDate to push also old news
             * */
            deal.orderDate = (diff.hour < 10 ? '0' + diff.hour : diff.hour) + '' + (diff.min < 10 ? '0' + diff.min : diff.min);

            if ((diff.day <= 1 && now.getDay() === dealTime.getDay()) || (diff.day < 1 && now.getDay() > dealTime.getDay())) {
              deals.push(deal);
            }
          });

          // Demo fix : remove duplicates for date conflict purpose
          return deals;
        });
    };

    this.getMyMooj = function (query) {
      return localUserService.getUser()
        .then(function (user) {
          return user._id;
        })
        .then(function (userId) {
          return $http
            .get('https://mooj.herokuapp.com/users/' + userId + '/deals?' + query)
            .then(function (response) {
              var now = new Date();
              var deals = [];

              angular.forEach(response.data, function (deal) {
                var dealTime = new Date(deal.time.raw);

                var tmp = now - dealTime;

                var diff = {};                       // Initialisation du retour

                tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
                diff.sec = tmp % 60;                    // Extraction du nombre de secondes

                tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
                diff.min = tmp % 60;                    // Extraction du nombre de minutes

                tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
                diff.hour = tmp % 24;                   // Extraction du nombre d'heures

                tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
                diff.day = tmp;

                deal.date = (diff.hour >= 1 ? diff.hour + 'h ' : '') + diff.min + 'mn';

                /*
                 * Demo fix : orderDate to push also old news
                 * */
                deal.orderDate = (diff.hour < 10 ? '0' + diff.hour : diff.hour) + '' + (diff.min < 10 ? '0' + diff.min : diff.min);

                if ((diff.day <= 1 && now.getDay() === dealTime.getDay()) || (diff.day < 1 && now.getDay() > dealTime.getDay())) {
                  deals.push(deal);
                }
              });
              return deals;
            });
        });
    };
  });

