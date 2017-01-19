'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:TabsController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc controller
 * @description Insures that tabs start back at the root beginning if user has navigated futher within the tab structure
 *
 */

angular.module('Outfitpic.Controller.Tab', [])
  .controller('TabsController', ['$scope', '$rootScope', '$state', 'NotificationService', 'FriendsService', 'LOCATIONS',
              '$ionicHistory', 'localStorageService',
    function ($scope, $rootScope, $state, NotificationService, FriendsService, LOCATIONS, $ionicHistory, localStorageService) {

      /////////////////////////////// CLOSE CAMERA BUTTON FUNCTION /////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name closeCameraButton
       * @description
       * Closes camera button if the user clicks on other bottom nav tabs when the upload modal is open
       *
       */
      var closeCameraButton = function(){
        $rootScope.isCameraBtnActive = false;
        var bottomNav = angular.element(document.querySelector('.footer-camera-icon'));
        if ($rootScope.isCameraBtnActive === true) {
          bottomNav.addClass('addCross');
        } else {
          bottomNav.removeClass('addCross');
        }
      };

      /////////////////////////////// ROOT START ON TAB SELECTION //////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name gotoDiscoverFeed
       * @description
       * Reset root path
       *
       */
      $scope.gotoDiscoverFeed = function () {
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        closeCameraButton();
        $state.go(LOCATIONS.DISCOVERFEED);
      };

      /**
       * @ngdoc function
       * @name gotoProfile
       * @description
       * Reset root path
       *
       */
      $scope.gotoProfile = function () {
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        closeCameraButton();
        $state.go(LOCATIONS.MAINPROFILEOUTFITS);
      };

      /**
       * @ngdoc function
       * @name gotoActivites
       * @description
       * Reset root path
       *
       */
      $scope.gotoActivites = function () {
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        closeCameraButton();
        $state.go(LOCATIONS.NOTIFICATIONS);
      };

      /**
       * @ngdoc function
       * @name gotoMyFeed
       * @description
       * Reset root path
       *
       */
      $scope.gotoMyFeed = function () {
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        closeCameraButton();
        $state.go(LOCATIONS.MYFEEDGRID);
      };

      //////////////////////////// BADGE NUMBER FOR NOTIFICATION REQUESTS //////////////////////////////////////////////
      //Return array length of notification count for badge
      var notificationsKeyRef = NotificationService.getNotificationsCountRef();
      notificationsKeyRef.on('value', function (snapshot) {
        $scope.notificationMessageBadgeTab = snapshot.val();
      });

      /////////////////////////////// TOGGLE BUTTONS FOR CAMERA ////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name uploadImageToggle
       * @description
       * Function to toggle camera icon in bottom nav
       *
       */
      $scope.uploadImageToggle = function () {
        $rootScope.isCameraBtnActive = !$rootScope.isCameraBtnActive;
        localStorageService.set('viewBeforeCamera', $state.current.name);
        var bottomNav = angular.element(document.querySelector('.footer-camera-icon'));
        if ($rootScope.isCameraBtnActive === true) {
          bottomNav.addClass('addCross');
        } else {
          bottomNav.removeClass('addCross');
        }
      };

    }]);


