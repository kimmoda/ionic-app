'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:ChangePasswordController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description change password function
 *
 */

angular.module('Outfitpic.Controller.ChangePassword', [])
  .controller('ChangePasswordController', ['$scope', '$state', 'Authentication', 'ShareData', 'LOCATIONS', 'PopUpService',
    function ($scope, $state, Authentication, ShareData, LOCATIONS, PopUpService) {

      /////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////////////////
      // Create empty user object for password reset
      $scope.user = {};
      var userObj = ShareData.returnItem();

      // Share details between controllers
      $scope.user.email = userObj.email;

      /////////////////////////////// CHANGE FUNCTION //////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function change
       * @description
       * Change password function
       */
      $scope.change = function () {
        Authentication.change($scope.user).then(function () {
          $state.go(LOCATIONS.DISCOVERFEED);
        }, function (error) {
          console.log(error);
          PopUpService.errorPopup(error);
        });
      }; //change password

    }]);
