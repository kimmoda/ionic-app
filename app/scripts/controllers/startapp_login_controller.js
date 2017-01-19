'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:LoginController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Login controller for main page
 *
 */

angular.module('Outfitpic.Controller.Login', [])
  .controller('LoginController', ['$scope', '$state', '$ionicHistory', '$timeout', 'Authentication',
              'LoadingSpinner', 'LOCATIONS', 'ProfileService', 'localStorageService', '$cordovaSQLite',
    function ($scope, $state, $ionicHistory, $timeout, Authentication, LoadingSpinner, LOCATIONS, ProfileService,
              localStorageService, $cordovaSQLite) {

      ///////////////////////////// BACK TO SIGNUP PAGE ////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name checkHistory
       * @description
       * This method checks if user has $ionicHistory stack
       * and if page has been hard refreshed
       */
      var checkHistory = function() {
        var v = $ionicHistory.viewHistory();
        $scope.showTempBackButton = false;
        if (v.backView === null) {
          $scope.showTempBackButton = true;
          $scope.myGoBack = function () {
            $scope.myform.$setUntouched();
            $state.go(LOCATIONS.SIGNUP);
          };
        }
      };
      checkHistory();

      /////////////////////////////// EMAIL REGEX //////////////////////////////////////////////////////////////////////
      // Allows user to add special characters within the username field
      $scope.EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

      /////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////////////////
      $scope.date = new Date();
      $scope.user = {};

      // Stores user details when logging in
      $scope.user.email = localStorageService.get('user');
      $scope.user.password = localStorageService.get('password');

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

      /////////////////////////////// LOGIN FUNCTION ///////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function login
       * @description
       * Scope login function
       */
      $scope.login = function () {
        LoadingSpinner.show();
        Authentication.login($scope.user).then(function (authData) {
          if (authData.password.isTemporaryPassword === true) {
            $state.go(LOCATIONS.CHANGEPASSWORD);
          } else {
            $scope.user.password = '';
            $scope.myform.$setUntouched();
            // check to see if profile setup was completed during registration
            var profileCompleteCheck = ProfileService.getProfile();
            profileCompleteCheck.$loaded().then(function () {
              localStorageService.set('userId', profileCompleteCheck.$id);
              if(profileCompleteCheck.profileCompleted === true){
                LoadingSpinner.hide();
                $state.go(LOCATIONS.DISCOVERFEED);
              } else{
                // if profile setup is not complete direct user to setup page
                LoadingSpinner.hide();
                $state.go(LOCATIONS.SETUPERROR);
              }
            });
          }
        }, function (error) {
          LoadingSpinner.hide();
          switch (error.code) {
            case 'INVALID_USER':
              $scope.message = true;
              $scope.errorMessage = 'The specified user account does not exist.';
              break;
            case 'INVALID_PASSWORD':
              $scope.message = true;
              $scope.errorMessage = 'The specified user account password is incorrect';
              break;
            case 'NETWORK_ERROR':
              if (error.code === 'NETWORK_ERROR') {
                $timeout(function () {
                  LoadingSpinner.hide();
                  $scope.message = true;
                  $scope.errorMessage = 'Network is down at the moment';
                }, 3000);
              }
              break;
          }
        }).finally(function () {

        });
      };

      /////////////////////////////// REGISTER - FB ////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function registerFB
       * @description
       * Register with FB Details
       */
      $scope.registerFB = function () {
        LoadingSpinner.show();
        Authentication.registerFB($scope.user).then(function () {
          $state.go(LOCATIONS.DISCOVERFEED);
        }, function (error) {
          $scope.message = error.toString();
        }).finally(function () {
          LoadingSpinner.hide();
        });
      };

      /////////////////////////////// REGISTER - TWITTER ///////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function registerTwitter
       * @description
       * Register with Twitter details
       */
      $scope.registerTwitter = function () {
        LoadingSpinner.show();
        Authentication.registerTwitter($scope.user).then(function () {
          $state.go(LOCATIONS.DISCOVERFEED);
        }, function (error) {
          $state.go(LOCATIONS.SIGNUP);
          $scope.message = error.toString();
        }).finally(function () {
          LoadingSpinner.hide();
        });
      };

    }]);









