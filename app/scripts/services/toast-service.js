/* **********************************************************************
 * @copyright: nshan
 * @date  : 18/11/15
 * @name  : toast-service.js
 * **********************************************************************
 *
 * @copyright (c) 2015 All rights reserved for Outfitpic LTD
 * **********************************************************************
 * @ngdoc service
 * @description for showing toast messages when user make changes to user profile
 *
 */
'use strict';
angular.module('Outfitpic.Service.ToastService', [])
	.service('ToastService', ['FIREBASE_URL', '$firebaseHelper', 'ProfileService', 'ionicToast',
		function (FIREBASE_URL, $firebaseHelper, ProfileService, ionicToast) {

      return {
        /**
         * @ngdoc function
         * @function greenToast
         * @description
         * Ionic green toast messaging service used for positive actions
         *
         * @params {Number} index reference for which toast message to send
         */
        greenToast: function(index){
          var Message;
          if(index == 1){
            Message = ionicToast.show('This item has been Added to your wardrobe', 'top', false, 80000);
            return Message;
          } else if(index == 2){
            Message = ionicToast.show('Your friend request has been sent', 'top', false, 80000);
            return Message;
          }
        },

        /**
         * @ngdoc function
         * @function blackToast
         * @description
         * Ionic black toast messaging service used for removal actions
         *
         * @params {Number} index reference for which toast message to send
         */
        blackToast: function(index){
          var Message;
          if(index == 1){
            Message = ionicToast.show('This item has been removed from your wardrobe', 'bottom', false, 80000);
            return Message;
          }
        },

        /**
         * @ngdoc function
         * @function redToast
         * @description
         * Ionic red toast messaging service used for error actions
         *
         * @params {Number} index reference for which toast message to send
         */
        redToast: function(index){
          var Message;
          if(index == 1){
            Message = ionicToast.show('This item has been removed from your profile', 'middle', false, 80000);
            return Message;
          } else if(index == 2){
            Message = ionicToast.show('You have reached the maximum items to tag', 'middle', false, 80000);
            return Message;
          } else if(index == 3){
            Message = ionicToast.show('This item has been removed from your feed', 'middle', false, 80000);
            return Message;
          }
        }
      };
		}]);
