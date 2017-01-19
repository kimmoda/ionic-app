'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:MainSettingsNotificationsEditController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Settings controller which 3 way bounds data
 *
 */

angular.module('Outfitpic.Controller.MainSettingsNotificationsEdit', [])
  .controller('MainSettingsNotificationsEditController', ['$scope', '$rootScope', 'ProfileService', 'localStorageService',
              '$ionicPopup', 'PopUpService',
    function ($scope, $rootScope, ProfileService, localStorageService, $ionicPopup, PopUpService) {

      /////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////////////////
      var regForNotifications = localStorageService.get('deviceToken');
      var pushNotification = cordova.require('com.pushwoosh.plugins.pushwoosh.PushNotification');
      var ProfileSetup = ProfileService.getProfile();

      /////////////////////////////// SWITCH VARIABLES /////////////////////////////////////////////////////////////////
      // Check to see if user has device token. If false UI switch shows as off
      if (regForNotifications === null) {
        $scope.pushNotification = {checked: false};
      } else {
        $scope.pushNotification = {checked: true};
      }

      ////////////////////// NOTIFICATION REGISTER / UNREGISTER ////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function pushNotificationChange
       * @description
       * Change notifications settings of the user
       *
       */
      $scope.pushNotificationChange = function () {
        if ($scope.pushNotification.checked === true) {
          pushNotification.registerDevice(
            function (status) {
              var deviceToken = status['deviceToken'];
              // add device token to local storage
              localStorageService.set('deviceToken', deviceToken);
              ProfileSetup.deviceToken = deviceToken;
              ProfileSetup.$save().then(function () {
              }, function (error) {
                PopUpService.errorPopup(error);
              });
            },
            function (status) {
              console.warn('failed to register : ' + JSON.stringify(status));
              PopUpService.errorPopup(status);
            }
          );
        } else {
          // remove device token to local storage
          localStorageService.remove('deviceToken');
          pushNotification.unregisterDevice(
            function () {
              ProfileSetup.deviceToken = null;
              ProfileSetup.$save().then(function () {
              }, function (error) {
                console.log('Error is:', error);
                PopUpService.errorPopup(error);
              });
            },
            function (status) {
              console.warn('registerDevice failed, status:' + status);
              PopUpService.errorPopup(status);
            }
          );
        }
      };
    }
  ]);
