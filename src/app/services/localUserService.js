'use strict';

angular.module('app')
  .service('localUserService', function ($rootScope, $http, $q, $window) {

    var user = null;
    var moojLocalId = $window.localStorage['moojLocalId'];

    function createUser(following) {
      return $http
        .post('https://mooj.herokuapp.com/users', {
          following: following || []
        })
        .then(function (response) {
          $window.localStorage['moojLocalId'] = response.data._id;
          user = response.data;
          return user;
        });
    }

    function updateUser(following) {
      console.log(following);
      return $http
        .put('https://mooj.herokuapp.com/users/' + moojLocalId, {
          following: following || []
        })
        .then(function (response) {
          user = response.data;
          console.log(user);
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
      if (user) {
        return $q.resolve(user);
      }
      else if (moojLocalId) {
        return getUser(moojLocalId);
      }
      else {
        return createUser();
      }
    };

    this.followMerchant = function (merchant) {
      var promise;

      if (!user) {
        promise = createUser([merchant._id]);
      }
      else {
        var following = user.following;
        following.push(merchant._id);

        promise = updateUser(following);
      }

      return promise;
    };

    this.followList = function (list) {
      var promise;
      var listIds = _.map(list.merchants, function (item) {
        return item._id;
      });

      if (!user) {
        promise = createUser(listIds);
      }
      else {
        var following = user.following;

        console.log(following);
        console.log(list);

        var merchants = _.uniq(following.concat(list));

        console.log(merchants);

        promise = updateUser(merchants);
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
