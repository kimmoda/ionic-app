/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:UserLevel
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Allows to check the user level and show certain tutorials on the page
 *
 */

'use strict';
angular.module('Outfitpic.Service.UpdateUserLevel', [])
  // use factory for services
  .factory('UpdateUserLevel', ['FIREBASE_URL', 'ProfileService',
    function (FIREBASE_URL, ProfileService) {

      var ref = new Firebase(FIREBASE_URL + '/userProfile/');
      var getUserId = function() {
        return ProfileService.getProfileId();
      };
      return {
        /**
         * @ngdoc function
         * @function updateProfileData
         * @description
         * Update user profile to show that user had read tutorial about section
         *
         */
        updateProfileData: function(){
          var userId = getUserId();
          var updateRef = ref.child(userId);
          updateRef.update({
            "tutorial/profilePage": true
          });
        }
      };

    }]);
