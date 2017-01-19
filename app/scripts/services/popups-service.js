'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:PopUpService
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Share data service which allows to pass data to the
 *				controller
 *
 */

angular.module('Outfitpic.Service.Popups', [])
  .factory('PopUpService', ['$ionicPopup', 'FriendsService', 'FIREBASE_URL', 'ToastService', '$rootScope',
           'NotificationService',
    function ($ionicPopup, FriendsService, FIREBASE_URL, ToastService, $rootScope, NotificationService) {

      return {
        /**
         * @ngdoc method
         * @method errorPopup
         * @description
         * Error ionic popup service
         *
         */
        errorPopup: function () {
          var myPopup = $ionicPopup.show({
            templateUrl: 'templates/views/popup/error.html',
            cssClass: 'error-popover',
            title: 'Lorem Ipsum dolor imit',
            subTitle: 'There was an issue loading this image',
            buttons: [{
              text: 'Close',
              type: 'button-primary-full',
              onTap: function () {

              }
            }]
          });
          myPopup.then(function () {
          });
        },

        /**
         * @ngdoc method
         * @method addUser
         * @description
         * Add user ionic popup service
         *
         */
        addUser: function(postUserId){
          $ionicPopup.show({
            templateUrl: 'templates/views/popup/add-friend.html',
            cssClass: 'add-user-popover',
            title: 'Do you want to add this user',
            subTitle: 'lorem ipsum dolor mit',
            buttons: [{
              text: 'Cancel',
              type: 'button-accent-full',
              onTap: function () {

              }
            }, {
              text: '<b>Add user</b>',
              type: 'button-primary-full',
              onTap: function () {
                FriendsService.requestFriendship(postUserId);
              }
            }]
          });
        },
        /**
         * @ngdoc method
         * @method deleteUser
         * @description
         * Delete friend function
         *
         * @param {String} userId User id
         */
        deleteUser: function(userId){
          $ionicPopup.show({
            templateUrl: 'templates/views/popup/remove-friend.html',
            cssClass: 'remove-friend-popover',
            title: 'Lorem Ipsum dolor imit',
            subTitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, quos!',
            buttons: [{
              text: 'Cancel',
              type: 'button-accent-full',
              onTap: function () {

              }
            }, {
              text: '<b>Delete</b>',
              type: 'button-primary-full',
              onTap: function () {
                FriendsService.deleteFriend(userId);
              }
            }]
          });
        },
        /**
         * @ngdoc method
         * @method deleteAllNotifications
         * @description
         * Delete all notification popup service
         *
         */
        deleteAllNotifications: function(){
          $ionicPopup.show({
            templateUrl: 'templates/views/popup/delete-notifications.html',
            cssClass: 'delete-notifications-popover',
            title: 'Delete all notifications',
            subTitle: 'Please note this can be reverted',
            buttons: [{
              text: 'Cancel',
              type: 'button-accent-full',
              onTap: function () {

              }
            }, {
              text: '<b>Delete</b>',
              type: 'button-primary-full',
              onTap: function () {
                NotificationService.deleteAllNotifications();
              }
            }]
          });
        }


      };
    }]);
