'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:SelectedUserController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Controller to show the details of member when the user clicks on avatar images
 *
 */

angular.module('Outfitpic.Controller.SelectedUser', [])
  .controller('SelectedUserController', ['$scope', '$state', '$stateParams', '$ionicHistory', 'ProfileService',
              'FIREBASE_URL', '$ionicPopup', 'UserLevel', 'localStorageService', 'NavigationServices', '$ionicModal',
    function ($scope, $state, $stateParams, $ionicHistory, ProfileService, FIREBASE_URL, $ionicPopup, UserLevel,
              localStorageService, NavigationServices, $ionicModal) {

      /////////////////////////////// GET HISTORY STACK ////////////////////////////////////////////////////////////////
      var viewHistory = $ionicHistory.viewHistory();

      //////////////////////// USER LEVEL DETECTION ////////////////////////////////////////////////////////////////////
      // Checks the user level allowing to show tutorials on pages
      UserLevel.checkUserLevel();

      /////////////////////////////// GRID TOGGLE //////////////////////////////////////////////////////////////////////
      // $scope variable for grid toggle button
      /**
       * @ngdoc function
       * @name changeGridToggle
       * @description
       * Toggle method for grid expanded and condensed view
       */
      $scope.isGridActive = true;
      $scope.changeGridToggle = function () {
        $scope.isGridActive = !$scope.isGridActive;
      };

      /////////////////////////////// SHOW BACK ARROW //////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name checkHistory
       * @description
       * This method checks if user has $ionicHistory stack
       * and if page has been hard refreshed
       */
      $scope.hideBackButton = false;
      var currentState = $state.current.name;

      var checkHistory = function() {
        if(viewHistory.backView === null){
          $scope.hideBackButton = true;
          $scope.showTempBackButton = true;
          $scope.myGoBack = function () {
            NavigationServices.goBackFunction(viewHistory, currentState);
          };
        } else if(NavigationServices.checkBackState(viewHistory)){
          $scope.hideBackButton = true;
          $scope.showTempBackButton = true;
          $scope.myGoBack = function () {
            NavigationServices.goBackFunction(viewHistory, currentState);
          };
        }
      };
      checkHistory();


      ///////////////////////////// GET USER PROFILE ///////////////////////////////////////////////////////////////////
      var selectedUserId = $stateParams.user_id;
      /**
       * @ngdoc function
       * @function checkProfileId
       * @description
       * Check if profile has id from state params. if not the id will be taken from local storage
       *
       */
      var checkProfileId = function(){
        if(!selectedUserId){
          selectedUserId = localStorageService.get('profileUserId');
          $scope.data = ProfileService.getProfileById(selectedUserId);
        } else{
          $scope.data = ProfileService.getProfileById(selectedUserId);
        }
      };
      checkProfileId();


      /////////////////////////////// VIEW PROFILE IMAGE ///////////////////////////////////////////////////////////////
      // Ionic modal directive for view profile image
      $ionicModal.fromTemplateUrl('templates/views/modals/user-profile-image.html', {
        id: '1',
        scope: $scope,
        cssClass: 'modal-styling',
        backdropClickToClose: false,
        animation: 'slide-in-right',
        focusFirstInput: true
      }).then(function (modal) {
        $scope.oModal1 = modal;
      });

      /**
       * @ngdoc function
       * @name expandItem
       * @description
       * Open view profile modal. If no image has been loaded, $ionicActionSheet
       * function will be called
       */
      $scope.expandItem = function(data){
        $scope.oModal1.show();
      };

      /**
       * @ngdoc function
       * @name closeModal
       * @description
       * Close modal function
       */
      $scope.closeModal = function () {
        $scope.oModal1.hide();
      };


      /////////////////////////////// USER POPOVER /////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function userOptions
       * @description
       * Open ionic popup directive
       *
       */
      $scope.userOptions = function () {
        var myPopup = $ionicPopup.show({
          templateUrl: 'templates/views/popup/user-options.html',
          cssClass: 'user-options-popover',
          title: 'Lorem Ipsum dolor imit',
          subTitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, quos!',
          buttons: [{
            text: 'Close',
            type: 'button-primary-full',
            onTap: function () {

            }
          }]
        });
        myPopup.then(function () {
        });
      };


    }]);
