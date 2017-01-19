'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:RegistrationController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc controller
 * @description Registers user into the application
 *
 */

angular.module('Outfitpic.Controller.Registration', [])
  .controller('RegistrationController', ['$scope', '$rootScope', '$state', '$q', '$ionicLoading', '$ionicModal',
              '$ionicHistory', '$timeout', 'Authentication', 'LoadingSpinner', 'LOCATIONS', '$ionicScrollDelegate',
              'FIREBASE_URL',
    function ($scope, $rootScope, $state, $q, $ionicLoading, $ionicModal, $ionicHistory, $timeout, Authentication,
              LoadingSpinner, LOCATIONS,  $ionicScrollDelegate, FIREBASE_URL) {

      /////////////////////////////// VARIABLES //////////////////////////////////////////////////////////////
      $scope.user = {};
      $scope.myform= {};

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

      /////////////////////////////// CLEAR CONFIRM PASSWORD FIELD /////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function clearUsernameField
       * @description
       * Clears error message on confirm password if the user has clicked back on create password field
       */
      $scope.clearUsernameField = function(){
        $scope.user.username = '';
        $scope.myform.username.$setPristine();
        $scope.myform.username.$setUntouched();
        $scope.myform.username.$setValidity();
        $scope.usernameTaken = false;
        $scope.usernameIsUnique = false;
      };

      /////////////////////////////// CHECK USERNAME FUNCTION //////////////////////////////////////////////////////////
      $scope.checkUsernameSpinner = false;
      // ng-blur function (called when user leaves the input field)
      $scope.checkUsername = function(username){
        // show loading spinner
        $scope.checkUsernameSpinner = true;

        //$scope.usernameTaken = false;
        var userNameCheck = username.$$rawModelValue;
        /**
         * @ngdoc function
         * @function checkIfUserExists
         * @description
         * Check if username exists on database
         */
        var checkIfUserExists = function(userNameCheck){
          var userImageRef = new Firebase(FIREBASE_URL + '/userProfile/');
          var keyRef = new Firebase(FIREBASE_URL + '/userProfile/');
          keyRef.orderByChild("createdAt").on('child_added', function(snap) {
            var imageId = snap.key();
            userImageRef.child(imageId).once('value', function(snap) {
              if(snap.val().username == userNameCheck){
                console.log('exists')
                $scope.usernameTaken = true;
                $scope.checkUsernameSpinner = false;
              }
                $scope.checkUsernameSpinner = false;
             });
          });
          if(!$scope.usernameTaken){
            $scope.usernameIsUnique = true;
          }
        };
        checkIfUserExists(userNameCheck);
      };

      /////////////////////////////// CLEAR CONFIRM PASSWORD FIELD /////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function clearConfirmPassword
       * @description
       * Clears error message on confirm password if the user has clicked back on create password field
       */
      $scope.clearConfirmPassword = function(){
        $scope.user.verify = '';
        $scope.myform.verify.$setPristine();
        $scope.myform.verify.$setUntouched();
        $scope.myform.verify.$setValidity();
        $scope.myform.verify.$error.nxEqualEx = false;
      };

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

      /////////////////////////////// REGISTER - EMAIL /////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function register
       * @description
       * Sign up with email function
       */
      $scope.register = function () {
        // cordova.plugins.Keyboard.close();
        LoadingSpinner.show();
        Authentication.register($scope.user).then(function () {
          Authentication.login($scope.user).then(function () {
            $state.go(LOCATIONS.SETUP);
            LoadingSpinner.hide();
          }, function (error) {
            switch (error.code) {
              case 'EMAIL_TAKEN':
                $scope.message = true;
                $scope.errorMessage = 'Email is taken by another user';
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
          });
        }, function (error) {
          switch (error.code) {
            case 'EMAIL_TAKEN':
              $scope.message = true;
              $scope.errorMessage = 'Email is taken by another user';
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
          LoadingSpinner.hide();
        });
      };

      /////////////////////////////// REGISTER - FB ////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function registerFB
       * @description
       * Sign up with FB function
       */
      $scope.registerFB = function () {
        LoadingSpinner.show();
        Authentication.registerFB($scope.user).then(function () {
          $state.go(LOCATIONS.MAINPROFILEOUTFITS);
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
       * Sign up with Twitter function
       */
      $scope.registerTwitter = function () {
        LoadingSpinner.show();
        Authentication.registerTwitter($scope.user).then(function () {
          $state.go(LOCATIONS.MAINPROFILEOUTFITS);
        }, function (error) {
          $state.go(LOCATIONS.SIGNUP);
          $scope.message = error.toString();
        }).finally(function () {
          LoadingSpinner.hide();
        });
      };

      /////////////////////////////// TERMS & CONDITIONS MODAL /////////////////////////////////////////////////////////
      // Terms & Conditions modal function
      $ionicModal.fromTemplateUrl('templates/views/modals/disclaimer.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function () {
        $scope.modal.show();
      };
      $scope.closeModal = function () {
        $scope.modal.hide();
      };

    }]);
