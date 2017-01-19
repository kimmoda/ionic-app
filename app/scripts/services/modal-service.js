/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:ModalService
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Allows to check the user level and show certain tutorials on the page
 *
 */

'use strict';
angular.module('Outfitpic.Service.ModalService', [])
  // use factory for services
  .factory('ModalService', ['$ionicModal', '$rootScope', 'UpdateUserLevel',
    function ($ionicModal, $rootScope, UpdateUserLevel) {


      var init = function(tpl, $scope) {

        var promise;
        $scope = $scope || $rootScope.$new();

        promise = $ionicModal.fromTemplateUrl(tpl, {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.test = 'test';
          $scope.modal = modal;
          return modal;
        });

        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          UpdateUserLevel.updateProfileData();
          $scope.modal.hide();
        };
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });

        return promise;
      };

      return {
        init: init
      }

    }]);
