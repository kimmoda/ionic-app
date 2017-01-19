'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:LogoutController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Logs user into the application
 *
 */

angular.module('Outfitpic.Controller.Logout', [])
  .controller('LogoutController', ['$scope', '$state', '$rootScope', '$ionicHistory', '$timeout',
              'Authentication', 'LOCATIONS', 'localStorageService',
    function ($scope, $state, $rootScope, $ionicHistory, $timeout, Authentication, LOCATIONS, localStorageService) {

      /////////////////////////////// LOGOUT FUNCTION //////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function logout
       * @description
       * Logout function which removes all session storage information but should keep username details of
       * last user
       */
      $scope.logout = function () {
        $timeout(function () {
          Authentication.logout();
          // Stops device going back into the application
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
          $ionicHistory.nextViewOptions({
            disableBack: true,
            historyRoot: true
          });
          // Clear data from local storage
          localStorageService.clearAll();
          $rootScope.showBackButton = null;
          $state.go(LOCATIONS.SIGNUP);
        }, 30);
      };

    }]);
