'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:MyConnectionsController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc controller
 * @descriptionMy personalized news feed
 *
 */

angular.module('Outfitpic.Controller.MyConnections', [])
  .controller('MyConnectionsController', ['$scope', 'FIREBASE_URL', 'UserLevel', 'FriendsService', 'UserCache',
              'ImageCache',
    function ($scope, FIREBASE_URL, UserLevel, FriendsService, UserCache, ImageCache) {

      //////////////////////// USER LEVEL DETECTION ////////////////////////////////////////////////////////////////////
      // Checks the user level allowing to show tutorials on pages
      UserLevel.checkUserLevel();

      /////////////////////////////// FRIEND REQUEST ARRAY /////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function getFriendRequests
       * @description
       * Get friend requests array
       *
       * @param  {Array}  array Array returned from Friend service request
       */
      FriendsService.getFriendRequests(function (array) {
        $scope.friendRequest = array;
      });

      /**
       * @ngdoc function
       * @function getFriendRequests
       * @description
       * Decline friend request
       *
       * @param  {String}  requesterId id passed into function
       */
      $scope.declineFriendship = function (requesterId) {
        FriendsService.declineFriendship(requesterId);
      };

      /**
       * @ngdoc function
       * @function addFriend
       * @description
       * Accept friend request function
       *
       * @param  {String}  requesterId id passed into function
       */
      $scope.addFriend = function(requesterId) {
        FriendsService.addFriend(requesterId);
      };

      /**
       var friendRequestRef = FriendsService.getFriendsRequestRef();
       friendRequestRef.on('value', function (snapshot) {
        $scope.friendRequest = snapshot.val();
        console.log('requests: '+$scope.friendRequest)
      });
       */

      ///////////////////////////// ATTACH AVATAR PROFILES /////////////////////////////////////////////////////////////
      /**
       * @ngdoc service
       * @description
       * User cache service from ng-init function attaching user profiles to the post
       *
       */
      $scope.users = UserCache.getCachedUserProfiles();

      ///////////////////////////// ATTACH IMAGES //////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc service
       * @description
       * Image cache service from ng-init function attaching uimage to item
       *
       */
      $scope.images = ImageCache.getCachedImageProfiles();


      /////////////////////////////// DELETE FRIEND REQUEST ////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function deleteItem
       * @description
       * delete friend request
       *
       */
      $scope.listCanSwipe = true;
      $scope.deleteItem = function(item){
        FriendsService.deleteFriendRequest(item.$id);
      };

    }
  ]);
