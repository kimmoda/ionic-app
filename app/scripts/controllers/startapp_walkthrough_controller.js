'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:WalkthroughController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Walkthrough slideshow that outlines what the app is about
 * @params
 */

angular.module('Outfitpic.Conrtoller.Walkthrough', [])
  .controller('WalkthroughController', ['$scope', '$state', '$rootScope', 'LOCATIONS', 'localStorageService',
    function ($scope, $state, $rootScope, LOCATIONS, localStorageService) {

      /////////////////////////////// WALKTHROUGH FUNCTION /////////////////////////////////////////////////////////////
      // Stores variable into local storage if user has used the app before and doesn't show
      // walkthrough upon logging in next time
      var usedAppBefore = localStorageService.get('usedAppBefore');
      if (usedAppBefore !== null) {
        $state.go(LOCATIONS.SIGNUP);
      }

      /**
       * @ngdoc function
       * @function getStarted
       * @description
       * Skip walkthrough function
       */
      $scope.getStarted = function () {
        localStorageService.set('usedAppBefore', 'true');
        localStorageService.set('regPushNotification', null);
        $state.go(LOCATIONS.SIGNUP);
      };

    }]);
