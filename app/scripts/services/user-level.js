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
angular.module('Outfitpic.Service.UserLevel', [])
  // use factory for services
  .factory('UserLevel', ['ProfileService', 'PopUpService', 'ModalService', 'MODALS',
    function (ProfileService, PopUpService, ModalService, MODALS) {
      var getUserLevel = function() {
        return ProfileService.getProfile();
      };
      return {
        /**
         * @ngdoc function
         * @function checkUserLevel
         * @description
         * Check what level the user is at
         *
         */
        checkUserLevel: function($scope){
          var level = getUserLevel();
          level.$loaded().then(function (user) {
            if(user.userLevel === 0){
              if(user.tutorial.profilePage == false){
                ModalService
                  .init(MODALS.PROFILETUTORIAL, $scope)
                  .then(function(modal) {
                    modal.show();
                  });
              }

            }
          }).catch(function (error) {
            PopUpService.errorPopup(error);
          });
        }
      };

    }]);
