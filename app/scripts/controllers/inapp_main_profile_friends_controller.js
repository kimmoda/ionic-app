'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:MainProfileFriendsController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Profile controller for the main profile section, data is 3-way bound
 *
 */

angular.module('Outfitpic.Controller.MainProfileFriends', [])
  .controller('MainProfileFriendsController', ['$scope', '$rootScope', '$firebaseArray', '$state',
              'UserImages', 'ProfileService', 'UserCache', 'FriendsService', 'LOCATIONS', 'UserLevel', '$timeout',
              '$ionicPopup', 'localStorageService', '$ionicHistory', 'NavigationServices', 'PopUpService',
    function ($scope, $rootScope, $firebaseArray, $state, UserImages, ProfileService, UserCache, FriendsService,
              LOCATIONS, UserLevel, $timeout, $ionicPopup, localStorageService, $ionicHistory, NavigationServices,
              PopUpService) {

      /////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////////////////
      // Get ionic history stack
      var viewHistory = $ionicHistory.viewHistory();

      ///////////////////////////////// VIEW USER PROFILE OF IMAGE /////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function viewUser
       * @description
       * Open state to view user profile of image posted
       *
       * @param  {String}  userId User ID of the person selected
       */
      $scope.viewUser = function (userId) {
        if(userId != $scope.userId){
          NavigationServices.viewUserState(viewHistory, userId);
        }
      };

      /////////////////////////////// FRIENDS ADDED ////////////////////////////////////////////////////////////////////
      var friendsRef = FriendsService.getMyFriendsRef();
      var friendScrollRef = new Firebase.util.Scroll(friendsRef, 'date');
      $scope.userFriends = $firebaseArray(friendScrollRef);
      friendScrollRef.scroll.next(10);
      $scope.noMoreUserFriends = false;
      $scope.userFriendCount = 0;
      $scope.userFriendUnknown = true;

      /**
       * @ngdoc function
       * @function loadMoreFriends
       * @description
       * Infinite scroll function to load more items when user gets to the bottom fo the screen
       *
       */
      $scope.loadMoreFriends = function () {
        friendScrollRef.scroll.next(10);
        if ($scope.userFriendUnknown) {
          FriendsService.countFriends(function (amount) {
            $scope.userFriendCount = amount;
            $scope.userFriendUnknown = false;
          });
        } else if ($scope.userFriends.length == $scope.userFriendCount) {
          $scope.noMoreUserFriendPlaceholder = true;
          $scope.noMoreUserFriends = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      ///////////////////////////// ATTACH AVATAR PROFILES /////////////////////////////////////////////////////////////
      /**
       * @ngdoc service
       * @description
       * User cache service from ng-init function attaching user profiles to the post
       *
       */
      $scope.users = UserCache.getCachedUserProfiles();

      /////////////////////////////// DELETE FRIEND ////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function deleteItem
       * @description
       * Delete friend from list
       *
       */
      $scope.listCanSwipe = true;
      $scope.deleteFriend = function(userId){
        PopUpService.deleteUser(userId);
      };


    }
  ]).filter('isEmpty', [
  function () {
    return function (object) {
      return angular.equals({}, object);
    };
  }
]);
