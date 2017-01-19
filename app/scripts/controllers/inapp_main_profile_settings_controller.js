'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:MainSettingsEditController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Profile controller for the main profile section, data is 3-way bound
 *
 */

angular.module('Outfitpic.Controller.MainSettingsEdit', [])
  .controller('MainSettingsEditController', ['$scope', '$rootScope', '$firebaseArray', '$firebaseObject',
              '$firebaseAuth', '$ionicPopup', '$timeout', '$state', '$ionicScrollDelegate', 'FIREBASE_URL',
              'UserImages', 'Camera', 'ProfileService', 'NewsFeed', 'LOCATIONS', '$ionicActionSheet', 'PopUpService',
    function ($scope, $rootScope, $firebaseArray, $firebaseObject, $firebaseAuth, $ionicPopup, $timeout, $state,
              $ionicScrollDelegate, FIREBASE_URL, UserImages, Camera, ProfileService, NewsFeed, LOCATIONS,
              $ionicActionSheet, PopUpService) {

      /////////////////////////////// BIND DATA ////////////////////////////////////////////////////////////////////////
      // 3 way bind user object with Firebase
      ProfileService.getProfile().$bindTo($scope, 'profileSetting');
      var ProfileSetup = ProfileService.getProfile();
      $scope.profileSetting = ProfileSetup;

      /////////////////////////////// UPLOAD USERS PROFILE PIC /////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function showActionSheet
       * @description
       * Show ionic action sheet directive to change user profile image
       *
       */
      $scope.showActionSheet = function() {
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
          $scope.profileSetting.avatar = {
            image: imageData,
            timestamp: Firebase.ServerValue.TIMESTAMP,
            imageType: 0
          };
          ProfileSetup.$save().then(function () {
          }, function (error) {
            PopUpService.errorPopup(error);
          });
        }, function (error) {
          PopUpService.errorPopup(error);
        });
      };

      /////////////////////////////// DELETE PROFILE POP UP ////////////////////////////////////////////////////////////
      $scope.data = {};

      /**
       * @ngdoc function
       * @function showDeletePopup
       * @description
       * Delete user profile
       */
      $scope.showDeletePopup = function () {
        $ionicPopup.show({
          templateUrl: 'templates/views/popup/remove-profile.html',
          cssClass: 'remove-profile-popover',
          title: 'Are you sure?',
          subTitle: 'Please provide your password and note, this can be reverted',
          scope: $scope,
          buttons: [{
            text: 'Delete',
            type: 'button-accent-full',
            onTap: function () {
              var ref = new Firebase(FIREBASE_URL);
              var postref = new Firebase(FIREBASE_URL + '/posts/');
              var usersRef = ref.child('posts').orderByChild('user').equalTo(ProfileSetup.$id);
              var userPostArray  = $firebaseArray(usersRef);
              userPostArray.$loaded().then(function () {
                angular.forEach(userPostArray, function(value) {
                  postref.child(value.$id).update({
                    'visible': false,
                    'wardrobeRef': null,
                    'upVote': null
                  });
                });
              });
              var deleteObject = {};
              deleteObject['timelines/' + ProfileSetup.$id] = null;
              ref.update(deleteObject, function (error) {
                if (error) {
                  PopUpService.errorPopup(error);
                }
              });
              ref.removeUser({
                email: ProfileSetup.email,
                password: $scope.data.password
              }, function (error) {
                if (error) {
                  switch (error.code) {
                    case 'INVALID_USER':
                      console.log('The specified user account does not exist.');
                      break;
                    case 'INVALID_PASSWORD':
                      console.log('The specified user account password is incorrect.');
                      break;
                    default:
                      console.log('Error removing user:', error);
                  }
                } else {
                  var deleteRef = new Firebase(FIREBASE_URL + '/userProfile/' + ProfileSetup.$id );
                  deleteRef.remove();
                  $state.go(LOCATIONS.DELETE);
                  console.log('User account deleted successfully!');
                }
              });
            }
          }, {
            text: '<b>Changed my mind</b>',
            type: 'button-primary-full',
            onTap: function () {

            }
          }]
        });


      };

    }
  ]);
