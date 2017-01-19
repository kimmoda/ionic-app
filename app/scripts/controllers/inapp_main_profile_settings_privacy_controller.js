'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:MainSettingsPrivacyController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Settings controller which 3 way bounds data
 *
 */

angular.module('Outfitpic.Controller.MainSettingsPrivacy', [])
  .controller('MainSettingsPrivacyController', ['$scope', '$rootScope', 'ProfileService', 'localStorageService',
              '$ionicPopup', 'PopUpService',
    function ($scope, $rootScope, ProfileService, localStorageService, $ionicPopup, PopUpService) {

      /////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////////////////
      var ProfileSetup = ProfileService.getProfile();

      /////////////////////////////// SWITCH VARIABLES /////////////////////////////////////////////////////////////////
      // access user object and return booleans for privacy settings
      ProfileSetup.$loaded().then(function (usrObj) {
        $scope.privacyWardrobe = {checked: usrObj.viewWardrobe};
        $scope.privacyOutfits = {checked: usrObj.viewOutfits};
        $scope.privacyLikes = {checked: usrObj.viewLikes};
      }).catch(function (error) {
        PopUpService.errorPopup(error);
      });


      ////////////////////// NOTIFICATION REGISTER / UNREGISTER ////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function privacySettingsChange
       * @description
       * Change the privacy settings of users posts
       *
       */
      $scope.privacySettingsChange = function (index) {
        if(index == 1){
          // Wardrobe function
          if($scope.privacyWardrobe.checked === true){
            console.log('fired')
            ProfileSetup.viewWardrobe = true;
            ProfileSetup.$save().then(function () {
            }, function (error) {
              PopUpService.errorPopup(error);
            });
          } else {
            ProfileSetup.viewWardrobe = false;
            ProfileSetup.$save().then(function () {
            }, function (error) {
              PopUpService.errorPopup(error);
            });
          }
        } else if (index == 2){
          // Outfits function
          if($scope.privacyOutfits.checked === true){
            ProfileSetup.viewOutfits = true;
            ProfileSetup.$save().then(function () {
            }, function (error) {
              PopUpService.errorPopup(error);
            });
          } else {
            ProfileSetup.viewOutfits = false;
            ProfileSetup.$save().then(function () {
            }, function (error) {
              PopUpService.errorPopup(error);
            });
          }
        } else {
          // Likes function
          if($scope.privacyLikes.checked === true){
            ProfileSetup.viewLikes = true;
            ProfileSetup.$save().then(function () {
            }, function (error) {
              PopUpService.errorPopup(error);
            });
          } else {
            ProfileSetup.viewLikes = false;
            ProfileSetup.$save().then(function () {
            }, function (error) {
              PopUpService.errorPopup(error);
            });
          }
        }



      };
    }
  ]);
