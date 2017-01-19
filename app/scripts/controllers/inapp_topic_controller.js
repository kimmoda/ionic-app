'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:TopicController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Posting picture process
 *
 */

angular.module('Outfitpic.Controller.Topic', [])
  .controller('TopicController', ['$scope', '$rootScope', '$ionicPopup', '$state', '$cordovaCamera', '$document',
              '$ionicModal', '$ionicHistory', '$timeout', 'FIREBASE_URL', 'Camera', 'ProfileService',
              'PostItemService', 'PostService',
    function ($scope, $rootScope, $ionicPopup, $state, $cordovaCamera, $document, $ionicModal, $ionicHistory,
              $timeout, FIREBASE_URL, Camera, ProfileService, PostItemService, PostService) {

      ///////////////////////////// CAPTURE IMAGE METHOD /////////////////////////////////////

      $scope.imgURI = false;
        $scope.getImage = function (source) {
        var options = {
          quality: 80,
          targetWidth: 512,
          targetHeight: 512,
          allowEdit: true,
          saveToPhotoAlbum: false,
          destinationType: 0,
          sourceType: source,
          popoverOptions: 0,
          cameraDirection: 0
        };

        Camera.getPicture(options).then(function (imageData) {
          PostItemService.saveImage(imageData);
          $scope.imgURI = 'data:image/jpeg;base64,' + imageData;
        }, function (err) {
          console.log('error is: ' + err);
        });
      };


      //var userObj = ProfileService.getProfile();
      $scope.topicPost = {};

      ///////////////////////////// TITLE MODAL //////////////////////////////////////////

      $ionicModal.fromTemplateUrl('templates/views/modals/topic-post.html', {
        id: '1',
        scope: $scope,
        cssClass: 'modal-styling',
        backdropClickToClose: false,
        animation: 'slide-in-up',
        focusFirstInput: true
      }).then(function (modal) {
        $scope.oModal1 = modal;
      });

      $scope.openModal = function () {
        $scope.oModal1.show();
      };

      $scope.closeModal = function () {
        console.log('fired');
        $scope.oModal1.hide();
      };

      ///////////////////////////// UPLOAD TOPIC //////////////////////////////////////////

      $scope.uploadTopic = function () {
        $scope.oModal1.hide();
        $rootScope.isCameraBtnActive = false;
        var bottomNav = angular.element(document.querySelector('.footer-camera-icon'));
        if ($rootScope.isCameraBtnActive === true) {
          bottomNav.addClass('addCross');
        } else {
          bottomNav.removeClass('addCross');
        }
        PostService.fanPost($scope.imgURI);
        PostService.postTopic();
        PostItemService.saveImage(null);
      };


    }]);
