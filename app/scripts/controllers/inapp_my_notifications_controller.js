'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:NotificationsController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc controller
 * @descriptionMy personalized news feed
 *
 */

angular.module('Outfitpic.Controller.Notifications', [])
  .controller('NotificationsController', ['$scope', '$rootScope','$timeout', 'FIREBASE_URL', 'UserImages',
              'ProfileService', 'UserCache', '$firebaseArray', 'ImageCache', '$state', 'NotificationService',
              'LOCATIONS', '$ionicScrollDelegate', '$ionicPopup', 'localStorageService', 'PopUpService',
              'NavigationServices', '$ionicHistory',
    function ($scope, $rootScope, $timeout, FIREBASE_URL, UserImages, ProfileService, UserCache,
              $firebaseArray, ImageCache, $state, NotificationService, LOCATIONS, $ionicScrollDelegate, $ionicPopup,
              localStorageService, PopUpService, NavigationServices, $ionicHistory) {

      /////////////////////////////// GET HISTORY STACK ////////////////////////////////////////////////////////////////
      // Get ionic history stack
      var viewHistory = $ionicHistory.viewHistory();

      ///////////////////////////////// SET ROOT STATE /////////////////////////////////////////////////////////////////
      // Sets the root state within local storage
      localStorageService.set('rootState', $state.current.name);

      /////////////////////////////// INFINITE LIST ////////////////////////////////////////////////////////////////////
      var baseRef = NotificationService.getNotificationsRef();
      var scrollRef = new Firebase.util.Scroll(baseRef, 'createdAt');
      $scope.notificationMessage = $firebaseArray(scrollRef);
      scrollRef.scroll.next(2);
      $scope.noMoreItemsAvailable = false;
      $scope.count = 0;
      $scope.isListAmountUnknown = true;
      /**
       * @ngdoc function
       * @function loadMore
       * @description
       * Infinite scroll function to load more items when user gets to the bottom fo the screen
       *
       */
      $scope.loadMore = function () {
        $scope.loadMoreItems = true;
        scrollRef.scroll.next(2);
        if ($scope.isListAmountUnknown) {
          NotificationService.getNotificationsLength(function (amount) {
            $scope.count = amount;
            $scope.isListAmountUnknown = false;
          });
        } else {
          if ($scope.notificationMessage.length == $scope.count) {
            $scope.noMorePlaceholder = true;
            $scope.noMoreItemsAvailable = true;
          }
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      /////////////////////////// ATTACH AVATAR PROFILES ///////////////////////////////////////////////////////////////
      /**
       * @ngdoc service
       * @description
       * User cache service from ng-init function attaching user profiles to the post
       *
       */
      $scope.users = UserCache.getCachedUserProfiles();

      /////////////////////////// ATTACH IMAGES ////////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc service
       * @description
       * Image cache service from ng-init function attaching uimage to item
       *
       */
      $scope.images = ImageCache.getCachedImageProfiles();

      /////////////////////////////// NOTIFICATIONS BADGE RESET ////////////////////////////////////////////////////////
      // Reset badge on footer tab
      NotificationService.resetBadge();

      var pushNotification = cordova.require('com.pushwoosh.plugins.pushwoosh.PushNotification');
      pushNotification.setApplicationIconBadgeNumber(0);

      /////////////////////////////// VIEW ITEM FROM NOTIFICATION //////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function changeState
       * @description
       * Opens image item and scrolls to comments of the image
       *
       * @param  {Object}  post Post object of item
       */
      $scope.changeState = function (post) {
        NotificationService.changeState(post);
        $state.go(LOCATIONS.NOTIFICATIONIMAGE, {group_id: post.postId});
        localStorageService.set('imageId', post.postId);
        localStorageService.set('previousState', $state.current.name);
      };

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
        // function will not run is userId matches the userId of post
        if($scope.userId != userId){
          NavigationServices.viewUserState(viewHistory, userId);
        }
      };

      ///////////////////////////////////// SCROLL TO TOP BUTTON ///////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function scrollToTop
       * @description
       * Scroll to top function. Appears only when user has scrolled from the top
       *
       */
      $scope.scrollToTop = function() {
        $ionicScrollDelegate.scrollTop(true);
      };

      /**
       * @ngdoc function
       * @function gotScrolled
       * @description
       * Scroll detection script to determine if user has scrolled and add class on up arrow icon
       *
       */
      $scope.gotScrolled = function() {
        var scrollPos = $ionicScrollDelegate.getScrollPosition().top;
        if(scrollPos > 0) {
          angular.element(document.getElementById('top-button')).addClass('back-top-top-anim');
        } else{
          angular.element(document.getElementById('top-button')).removeClass('back-top-top-anim');
        }
      };

      /////////////////////////////// DELETE NOTIFICATION //////////////////////////////////////////////////////////////
      $scope.listCanSwipe = true;
      /**
       * @ngdoc function
       * @function deleteItem
       * @description
       * Delete notification item
       *
       * @param  {Object}  item Delete notification object
       */
      $scope.deleteItem = function(item){
        NotificationService.deleteNotification(item);
      };

      /////////////////////////////// DELETE ALL NOTIFICATIONS /////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function deleteAllNotifications
       * @description
       * Delete All notifications
       *
       */
      $scope.deleteAllNotifications = function() {
        PopUpService.deleteAllNotifications();
      };

    }
  ]);
