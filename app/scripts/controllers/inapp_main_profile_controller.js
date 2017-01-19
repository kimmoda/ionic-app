'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:MainProfileController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Profile controller for the main profile section, data is 3-way bound
 *
 */

angular.module('Outfitpic.Controller.MainProfile', [])
  .controller('MainProfileController', ['$scope','ProfileService', '$ionicModal', 'localStorageService', 'Camera',
              '$ionicActionSheet', '$state', 'PopUpService', 'UserLevel', '$timeout', '$rootScope', 'FIREBASE_URL',
              'ModalService', 'MODALS',
    function ($scope, ProfileService, $ionicModal, localStorageService, Camera, $ionicActionSheet, $state, PopUpService,
              UserLevel, $timeout, $rootScope, FIREBASE_URL, ModalService, MODALS) {

      //////////////////////// USER LEVEL DETECTION ////////////////////////////////////////////////////////////////////
      // Checks the user level allowing to show tutorials on pages
      UserLevel.checkUserLevel();

      /////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////////////////
      // retrieve user object from local storage
      var userObjId = localStorageService.get('userId');

      //////////////////////// SET ROOT STATE //////////////////////////////////////////////////////////////////////////
      // Sets the root state within local storage
      localStorageService.set('rootState', $state.current.name);

      /////////////////////////////// GRID TOGGLE //////////////////////////////////////////////////////////////////////
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

      /////////////////////////////// BIND SCOPE DATA //////////////////////////////////////////////////////////////////
      // Return user object from Profile Service
      var userObj = ProfileService.getProfile();
      userObj.$loaded().then(function (user) {
        $scope.data = user;
        // added timeout function to move item counts into new digest cycle
        $timeout(function () {
          $scope.wardrobe = user.wardrobe;
          $scope.posts = user.posts;
          $scope.likedPost = user.likedPost;
          if(user.avatar != undefined){
            $scope.imageType = user.avatar.imageType;
          }
        }, 0);

      }).catch(function (error) {
        PopUpService.errorPopup(error);
      });

      /////////////////////////////// CHECK FOR CHANGES ////////////////////////////////////////////////////////////////
      var firebaseRef = new Firebase(FIREBASE_URL + '/userProfile/' +  userObjId );
      // listen for changes in all items and update count
      firebaseRef.on('child_changed', function() {
        userObj.$loaded().then(function (user) {
          // added timeout function to move item counts into new digest cycle
          $timeout(function () {
            $scope.wardrobe = user.wardrobe;
            $scope.posts = user.posts;
            $scope.likedPost = user.likedPost;
          }, 0);
        }).catch(function (error) {
          PopUpService.errorPopup(error);
        });
      });


      /////////////////////////////// VIEW PROFILE IMAGE ////////////////////////////////////////////////////////////////
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
        if(!data.avatar){
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: 'Take Photo' },
              { text: 'Upload from album' }
            ],
            cancelText: 'Cancel',
            buttonClicked: function(index) {
              if(index === 0){
                $scope.getImage(1);
                hideSheet();
              } else if (index == 1){
                $scope.getImage(0);
                hideSheet();
              }
            }
          });
        } else{
          $scope.oModal1.show();
        }
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

      /**
       * @ngdoc function
       * @function getImage
       * @description
       * Opens cordova camera function
       */
      $scope.getImage = function (source) {
        var options = {
          quality: 80,
          targetWidth: 512,
          targetHeight: 512,
          allowEdit: true,
          saveToPhotoAlbum: false,
          destinationType: 0,
          sourceType: source,
          popoverOptions: CameraPopoverOptions,
          cameraDirection: 0
        };
        Camera.getPicture(options).then(function (imageData) {
          $scope.data.avatar = {
            image: imageData,
            timestamp: Firebase.ServerValue.TIMESTAMP,
            imageType: 0
          };
          userObj.$save().then(function () {
          }, function (error) {
            PopUpService.errorPopup(error);
          });
        }, function (error) {
          PopUpService.errorPopup(error);
        });
      };

      /////////////////////////////// REWARDS MODAL ////////////////////////////////////////////////////////////////////
      $scope.modal1 = function() {
        ModalService
          .init(MODALS.USERLEVEL, $scope)
          .then(function(modal) {
            modal.show();
          });
      };

      $scope.closeModal = function() {
        $scope.modal.hide();
      };


    }
  ]).filter('isEmpty', [
  function () {
    return function (object) {
      return angular.equals({}, object);
    };
  }
]);
