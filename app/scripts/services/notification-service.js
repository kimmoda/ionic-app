'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:NotificationService
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Notification methods for sending objects and delete methods
 *
 *
 */

angular.module('Outfitpic.Service.NotificationService', [])
  .factory('NotificationService', ['$state', 'FIREBASE_URL', 'ProfileService', '$rootScope', '$firebaseHelper',
    function ($state, FIREBASE_URL, ProfileService, $rootScope, $firebaseHelper) {

      var notificationsKeyRef;

      return {
        /**
         * @ngdoc method
         * @method getNotificationsLength
         * @description
         * Got notifications length and pass string into notifications badge
         *
         * @param   {Function}  callbackFunction Callback function
         */
        getNotificationsLength: function (callbackFunction) {
          var userId = ProfileService.getProfileId();
          notificationsKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + userId + '/notifications/');
          notificationsKeyRef.on('value', function (snapshot) {
            callbackFunction(snapshot.numChildren());
          });
        },


        /**
         * @ngdoc method
         * @method getNotificationsRef
         * @description
         * return notification key reference
         *
         * @return   {Object}  notificationsKeyRef notification reference
         */
        getNotificationsRef: function () {
          var userId = ProfileService.getProfileId();
          notificationsKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + userId + '/notifications/');
          return notificationsKeyRef;
        },

        /**
         * @ngdoc method
         * @method getNotificationsCountRef
         * @description
         * return notification key reference
         *
         * @return   {Object}  notificationsKeyRef notification count reference
         */
        getNotificationsCountRef: function () {
          var userId = ProfileService.getProfileId();
          notificationsKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + userId + '/notificationCount/');
          return notificationsKeyRef;
        },

        /**
         * @ngdoc method
         * @method changeState
         * @description
         * Change state of notification to 'read' so that user knows what they have read
         *
         * @param   {Object}  post Post object
         */
        changeState: function (post) {
          var userId = ProfileService.getProfileId();
          notificationsKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + userId + '/notifications/');
          var statusRef = notificationsKeyRef.child(post.$id);
          statusRef.update({
            'status': 'read'
          });
        },

        /**
         * @ngdoc method
         * @method resetBadge
         * @description
         * Reset badge number in footer
         *
         */
        resetBadge: function () {
          var userId = ProfileService.getProfileId();
          var notificationCountRef = new Firebase(FIREBASE_URL + '/userProfile/' + userId + '/notificationCount/');
          notificationCountRef.transaction(function () {
            $rootScope.notificationMessageBadge = 0;
            return 0;
          });
        },

        /**
         * @ngdoc method
         * @method deleteNotification
         * @description
         * Delete notification function
         *
         * @param   {Object}  item Post item object
         */
        deleteNotification: function (item) {
          var userId = ProfileService.getProfileId();
          var notificationDeleteRef = new Firebase(FIREBASE_URL + '/userProfile/' + userId + '/notifications/' + item.$id);
          notificationDeleteRef.remove();
        },

        /**
         * @ngdoc method
         * @method deleteAllNotifications
         * @description
         * Delete all notifications function
         *
         */
        deleteAllNotifications: function () {
          var userId = ProfileService.getProfileId();
          var notificationDeleteRef = new Firebase(FIREBASE_URL + '/userProfile/' + userId + '/notifications/');
          notificationDeleteRef.remove();
        }

      };
    }]);


