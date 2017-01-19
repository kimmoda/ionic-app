'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:forgotPasswordController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Forgotten password section
 *
 */

angular.module('Outfitpic.Controller.ForgotPassword', [])
  .controller('ForgotPasswordController', ['$scope', '$state', 'Authentication', 'LOCATIONS', 'ShareData',
    function ($scope, $state, Authentication, LOCATIONS, ShareData) {

      /////////////////////////////// RESET FORM WHEN GO BACK //////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function resetForm
       * @description
       * Resets form to pristine and untouched when the user clicks back from login page
       */
      $scope.resetForm = function () {
        $scope.myform.$setUntouched();
      };

      /////////////////////////////// FORGOT PASSWORD FUNCTION /////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function forgot
       * @description
       * Scope forgot function
       */
      $scope.forgot = function () {
        ShareData.saveEmail($scope.user);
        cordova.plugins.Keyboard.close();
        Authentication.forgot($scope.user).then(function () {
          $state.go(LOCATIONS.CHANGEPASSWORD);
        }, function () {
          $scope.errorMessage = true;
          $scope.message = 'The specified user account does not exist.';
        });
      };
    }]);
