'use strict';

angular.module('app')
  .service('localUserService', function ($rootScope, $http, $q, $window) {
    var user = null;
    var moojLocalId = $window.localStorage.moojLocalId;

    function createUser(following) {
      return $http
        .post('https://mooj.herokuapp.com/users', {
          following: following || []
        })
        .then(function (response) {
          $window.localStorage.moojLocalId = response.data._id;
          user = response.data;
          return user;
        });
    }

    function updateUser(following) {
      return $http
        .put('https://mooj.herokuapp.com/users/' + moojLocalId, {
          following: following || []
        })
        .then(function (response) {
          user = response.data;
          return user;
        });
    }

    function getUser(id) {
      return $http
        .get('https://mooj.herokuapp.com/users/' + id)
        .then(function (response) {
          user = response.data;
          return user;
        });
    }

    this.getUser = function () {
      var resolve;

      if (user) {
        resolve = $q.resolve(user);
      } else if (moojLocalId) {
        resolve = getUser(moojLocalId);
      } else {
        resolve = createUser();
      }

      return resolve;
    };

    this.followMerchant = function (merchant) {
      var promise;

      if (user) {
        var following = user.following;
        following.push(merchant._id);

        promise = updateUser(following);
      } else {
        promise = createUser([merchant._id]);
      }

      return promise;
    };

    this.followList = function (list) {
      var promise;
      var listIds = _.map(list.merchants, function (item) {
        return item._id;
      });

      if (user) {
        var following = user.following;
        var merchants = _.uniq(following.concat(list));

        promise = updateUser(merchants);
      } else {
        promise = createUser(listIds);
      }

      return promise;
    };

    this.unfollowMerchant = function (merchant) {
      var nowFollowing = _.filter(user.following, function (following) {
        return following._id !== merchant._id;
      });

      return updateUser(nowFollowing);
    };

    this.updateName = function (name) {
      return $http
        .put('https://mooj.herokuapp.com/users/' + moojLocalId, {
          name: name || ''
        })
        .then(function (response) {
          user = response.data;
          return user;
        });
    };
  });
