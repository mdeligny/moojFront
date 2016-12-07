'use strict';

angular.module('app')
  .service('filterService', function () {
    var filter = {
      categories: [],
      labels: [],
      location: ''
    };
    var callBacks = [];

    function notifyListeners() {
      callBacks.forEach(function (callBack) {
        callBack();
      });
    }

    this.addListener = function (callBack) {
      callBacks.push(callBack);
    };

    this.removeCategory = function (categoryToRemove) {
      var categories = [];

      filter.categories.forEach(function (category) {
        if (category !== categoryToRemove) {
          categories.push(category);
        }
      });

      filter.categories = categories;

      notifyListeners();
    };

    this.addCategory = function (category) {
      filter.categories.push(category);
      notifyListeners();
    };

    this.setLabel = function (label) {
      filter.labels = [label];
      notifyListeners();
    };

    this.removeLabel = function () {
      filter.labels = [];
      notifyListeners();
    };

    this.getLabel = function () {
      return filter.labels;
    };

    this.setLocation = function (location) {
      filter.location = location;
    };

    this.getLocation = function () {
      return filter.location;
    };

    this.resetFilter = function () {
      filter = {
        categories: [],
        labels: []
      };
      notifyListeners();
    };

    this.getQuery = function () {
      var query = '';

      if (filter.categories.length > 0 || filter.labels.length > 0) {
        var categories = [];

        if (filter.categories.length > 0) {
          categories = categories.concat(filter.categories);
        }

        if (filter.labels.length > 0) {
          var labels = filter.labels.map(function (label) {
            return label._id;
          });

          categories = categories.concat(labels);
        }

        query = 'category=' + categories.join();
      }
      return query;
    };
  });
