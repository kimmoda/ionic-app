'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:ProfileSetupController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc controller
 * @description Post profile setup section allowing to gather additional data
 *
 */

angular.module('Outfitpic.Controller.ProfileSetup', [])
  .controller('ProfileSetupController', ['$scope', '$rootScope', '$state', '$ionicPopup', '$firebaseArray',
              'FIREBASE_URL', 'ProfileService', 'Camera', 'LOCATIONS', '$ionicActionSheet', 'ClothingItems',
              'CountrySelect', '$window','PopUpService', 'localStorageService',
    function ($scope, $rootScope, $state, $ionicPopup, $firebaseArray, FIREBASE_URL, ProfileService, Camera,
              LOCATIONS, $ionicActionSheet, ClothingItems, CountrySelect, $window, PopUpService, localStorageService) {

      /////////////////////////////// BIND DATA ////////////////////////////////////////////////////////////////////////
      // Firebase 3 way bind data function
      ProfileService.getProfile().$bindTo($scope, 'setupProfile');
      var ref = new Firebase(FIREBASE_URL);
      var userRef = new Firebase(FIREBASE_URL + '/userProfile/');
      var ProfileSetup = ProfileService.getProfile();
      $scope.deviceWidth = $window.screen.width;
      $scope.deviceToken = null;

      /////////////////////////////// REGISTER FOR PUSH NOTIFICATION ///////////////////////////////////////////////////
      /**
       * Pushwoosh registration function
       */
      // var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");
      // pushNotification.registerDevice(
      //   function(status) {
      //     var deviceToken = status['deviceToken'];
      //     $scope.deviceToken = deviceToken;
      //     console.log('registerDevice: ' + deviceToken);
      //     localStorageService.set('deviceToken', deviceToken);
      //   },
      //   function(status) {
      //     console.warn('failed to register push woosh: ' );
      //     ProfileSetup.deviceToken = false;
      //       var myPopup = $ionicPopup.show({
      //         templateUrl: 'templates/views/popup/error.html',
      //         cssClass: 'error-popover',
      //         title: 'Lorem Ipsum dolor imit',
      //         subTitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, quos!',
      //         buttons: [{
      //           text: 'Close',
      //           type: 'button-primary-full',
      //           onTap: function () {

      //           }
      //         }]
      //       });
      //       myPopup.then(function () {
      //       });
      //   }
      // );

      /////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////////////////
      /**
       * Setup user profile object
       */
      $scope.user = {};
      $scope.user.ageRange = 0;
      $scope.slider = {
        value: 0,
        options: {
          floor: 0,
          ceil: 70
        }
      };

      /**
       * Select add range and return ID of age selected
       */
      $scope.addAge = function(range){
        if(range == 1){
          $scope.user.ageRange = range;
          $scope.range1Active = !$scope.range1Active;
          $scope.range2Active = false;
          $scope.range3Active = false;
          $scope.range4Active = false;
        }
        if(range == 2){
          $scope.user.ageRange = range;
          $scope.range1Active = false;
          $scope.range2Active = !$scope.range2Active;
          $scope.range3Active = false;
          $scope.range4Active = false;
        }
        if(range == 3){
          $scope.user.ageRange = range;
          $scope.range1Active = false;
          $scope.range2Active = false;
          $scope.range3Active = !$scope.range3Active;
          $scope.range4Active = false;
        }
        if(range == 4){
          $scope.user.ageRange = range;
          $scope.range1Active = false;
          $scope.range2Active = false;
          $scope.range3Active = false;
          $scope.range4Active = !$scope.range4Active;

        }

      };

      /**
       * Create user likes array
       */
      $scope.user.likes = [];
      $scope.setupStart = true;
      $scope.setupBrand = false;
      $scope.isActiveMale = false;
      $scope.isActiveFemale = false;
      $scope.likesLength = 0;

      /////////////////////////////// STEP PROCESS /////////////////////////////////////////////////////////////////////
      /**
       * Step process using ng-if for each section
       */
      $scope.showSetupStart = function () {
        $scope.setupDescription = false;
        $scope.setupStart = true;
        $scope.setupAge = false;
      };

      $scope.showSetupDescription = function () {
        $scope.setupStart = false;
        $scope.setupDescription = true;
        $scope.setupAge = false;
      };

      $scope.showSetupAge = function () {
        $scope.setupDescription = false;
        $scope.setupAge = true;
        $scope.setupBrand = false;
      };

      $scope.showSetupBranding = function () {
        $scope.setupAge = false;
        $scope.setupBrand = true;
        $scope.setupAvatar = false;
      };

      $scope.showSetupAvatar = function () {
        $scope.setupBrand = false;
        $scope.setupAvatar = true;
        $scope.setupLocation = false;
      };

      $scope.showSetupLocation = function () {
        $scope.setupLocation = true;
        $scope.setupAvatar = false;
      };

      /////////////////////////////// SEX SELECTION ////////////////////////////////////////////////////////////////////
      $scope.selectMale = function () {
        $scope.isActiveMale = !$scope.isActiveMale;
        $scope.isActiveFemale = false;
        if ($scope.isActiveMale === true) {
          $scope.user.sex = 'male';
        } else {
          $scope.user.sex = '';
        }
      };
      $scope.selectFemale = function () {
        $scope.isActiveFemale = !$scope.isActiveFemale;
        $scope.isActiveMale = false;
        if ($scope.isActiveFemale === true) {
          $scope.user.sex = 'female';
        } else {
          $scope.user.sex = '';
        }
      };

      /////////////////////////////// BRAND SELECTION //////////////////////////////////////////////////////////////////
      $scope.addItemToggle = function (item) {
        item.selected = !item.selected;
        if (item.selected) {
          $scope.user.likes.push({
            brand: item.brandName,
          });
        } else {
          var index = $scope.user.likes.indexOf(item);
          $scope.user.likes.splice(index, 1);
        }

        $scope.likesLength = $scope.user.likes.length;
      };

      /////////////////////////////// CHANGE AVATAR ////////////////////////////////////////////////////////////////////
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
       * Cordova get image function accessing either camera or photo album
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
          $scope.setupProfile.avatar = {
            image: imageData,
            timestamp: Firebase.ServerValue.TIMESTAMP,
            // image type for users setup profile with email
            imageType: 0
          };

          ProfileSetup.$save().then(function () {
          }, function (error) {
            console.log('Error is:', error);
            PopUpService.errorPopup(error);
          });
        }, function (error) {
          console.log('Error is: ' + error);
          PopUpService.errorPopup(error);
        });
      };

      $scope.selectNotification = function () {
        $scope.activateNotification = !$scope.activateNotification;
      };

      /**
       * Upload to Firebase function
       */
      $scope.upload = function () {
        ProfileSetup.ageRange = $scope.user.ageRange;
        ProfileSetup.description = $scope.user.description;
        ProfileSetup.sex = $scope.user.sex;
        ProfileSetup.likes = $scope.user.likes;
        ProfileSetup.location = $scope.user.destination.name;
        ProfileSetup.profileCompleted = true;
        ProfileSetup.deviceToken = $scope.deviceToken;
        ProfileSetup.$save().then(function () {
        }, function (error) {
          console.log('Error is:', error);
        });
        userRef.child(ProfileSetup.$id).update({
          'tutorial/profilePage': false
        });
        var date = new Date();
        var setupObject = {};
        var newPostRef = ref.child('posts').push();
        var newPostKey = newPostRef.key();
        // Creates an intro message within the users timeline upon initial registration
        setupObject['/timelines/' + '/'+ProfileSetup.$id+'/' + newPostKey] = {
          fbTimestamp: Firebase.ServerValue.TIMESTAMP,
          timestamp: date,
          createdAt: 0 - Date.now(),
          user: 1,
          topicPost: 'Welcome to outfitpic, this is your own feed where you can follow people and filter out the ' +
                      'ones you like from the main feed. Feel free to remove and add as you please. Have Fun',
          gridId: 2
        };
        ref.update(setupObject, function (error) {
          if (error) {
            console.log('Error updating data:', error);
            PopUpService.errorPopup(error);
          }
        });
        $state.go(LOCATIONS.MAINPROFILEOUTFITS);
      };

      /////////////////////////////// BRAND LIST JSON //////////////////////////////////////////////////////////////////
      /**
       * Return array of objects from services
       */
      $scope.brandlist = ClothingItems.returnSetupBrands();
      $scope.countries = CountrySelect.countryList();

    }]);
