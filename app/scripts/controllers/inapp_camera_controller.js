'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:CameraController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Posting picture process
 *
 */

angular.module('Outfitpic.Controller.Camera', [])
  .controller('CameraController', ['$scope', '$rootScope', '$ionicGesture', '$ionicPopup', '$state', '$cordovaCamera',
    '$document', '$ionicPosition', '$ionicModal', '$ionicHistory', '$timeout', 'FIREBASE_URL', 'Camera',
    'PositionService', 'PostItemService', 'ProfileService', 'LOCATIONS', 'ClothingItems', 'PostService',
    'ToastService', 'localStorageService',
    function ($scope, $rootScope, $ionicGesture, $ionicPopup, $state, $cordovaCamera, $document, $ionicPosition,
              $ionicModal, $ionicHistory, $timeout, FIREBASE_URL, Camera, PositionService, PostItemService,
              ProfileService, LOCATIONS, ClothingItems, PostService, ToastService, localStorageService) {

      ///////////////////////////// VARIABLES //////////////////////////////////////////////////////////////////////////
      // starts the image with null so previous image is not shown
      $rootScope.imgURI = null;
      var count = 0;

      ///////////////////////////// DIRECTS USER BACK TO MAIN //////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function myGoBack
       * @description
       * Allows user to go back to previous page and changes the camera icon in footer
       */
      $scope.myGoBack = function () {
        $scope.oModal3.show();
      };

      ///////////////////////////// CHECK HISTORY STATE ////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function checkHistory
       * @description
       * Checks if the user has hard refreshed the page and has no history
       */

      /**
       * @ngdoc function
       * @function closeCamera
       * @description
       * Close camera taking process and go back to last viewed screen
       */
      $scope.closeCamera = function(){
        console.log('fired');
        $scope.items = PostItemService.resetItems();
        $rootScope.imgURI = null;
        count = PostItemService.resetCount();
        var v = $ionicHistory.viewHistory();
        if (!v.backView) {
          $state.go(localStorageService.get('viewBeforeCamera'));
          $scope.oModal3.hide();
        } else {
          $ionicHistory.goBack();
          $scope.oModal3.hide();
        }
        $rootScope.isCameraBtnActive = false;
        var bottomNav = angular.element(document.querySelector('.footer-camera-icon'));
        if ($rootScope.isCameraBtnActive === true) {
          bottomNav.addClass('addCross');
        } else {
          bottomNav.removeClass('addCross');
        }

      };

      $scope.closeBackModal = function(){
        $scope.oModal3.hide();
      };

      ///////////////////////////// CAPTURE IMAGE METHOD ///////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function getImage
       * @description
       * Opens cordova camera function
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
          popoverOptions: 0,
          cameraDirection: 0
        };
        Camera.getPicture(options).then(function (imageData) {
          PostItemService.saveImage(imageData);
          localStorageService.set('imageData', imageData);
          $state.go(LOCATIONS.CAMERA);
        }, function (error) {
          console.log(error);
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
        });
      };

      ///////////////////////////// VARIABLES //////////////////////////////////////////////////////////////////////////
      // return image from postItemService
      var v = $ionicHistory.viewHistory();
      if (!v.backView) {
        $rootScope.imgURI = localStorageService.get('imageData');
      } else {
        $rootScope.imgURI = PostItemService.returnImage();
      }

      var width;
      var height;
      if($rootScope.imgURI){
        width = document.getElementById('imageContainer').offsetWidth;
        height = document.getElementById('imageContainer').offsetHeight;
        PositionService.saveDeviceDimensions(width, height);
      }

      // return items array from postItemService
      $scope.items = PostItemService.returnItem();
      $scope.photoDetails = {};
      var userObj = ProfileService.getProfile();
      if(userObj.sex == 'male'){
        $scope.sex = true;
      } else{
        $scope.sex = false;
      }


      ///////////////////////////// ADD TAG ////////////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function addTag
       * @description
       * opens Cordova camera function
       */
      $scope.addTag = function () {
        // Allows only 5 items to be tagged
        if(count <= 4){
          $scope.tagShow = true;
          $timeout(function () {
            var selectedPin = angular.element(document.getElementById('tagpin_' + count));
            // Add inline style to tag when gesture is finished
            selectedPin.css({
              display: 'block',
              left:$scope.positionX + 'px',
              top: $scope.positionY + 'px'
            });
            count++;
          }, 0);
          PostItemService.addItem(PostItemService.returnCount());
          $scope.object = $scope.items[count];
          // Opens Autocomplete Modal
          $scope.oModal2.show();
        } else{
          ToastService.redToast(2);
        }
      };

      var checkPosition = function(lastPosX, lastPosY, event, element){
        var parentWidth = event.target.clientWidth;
        var parentHeight = event.target.clientHeight;
        var elementW = element[0].offsetWidth;
        var elementH = element[0].offsetHeight;
        if (lastPosX >= 0 && lastPosX >= (parentWidth - (elementW *2)) && lastPosY >= (elementH * 2)) {
          console.log('farRight function');
          angular.element(element[0]).addClass('farRight');
          angular.element(element[0]).removeClass('farTop');
          angular.element(element[0]).removeClass('farTopLeft');
          angular.element(element[0]).removeClass('farLeft');
          var fr = 'farRight';
          PositionService.setClass(fr);
        } else if (lastPosY >= 0 && lastPosY <= (elementH * 2) && lastPosX >= 0 && lastPosX >= elementW) {
          console.log('farTop function');
          angular.element(element[0]).addClass('farTop');
          angular.element(element[0]).removeClass('farRight');
          angular.element(element[0]).removeClass('farTopLeft');
          angular.element(element[0]).removeClass('farLeft');
          var ft = 'farTop';
          PositionService.setClass(ft);
        } else if (lastPosY >= 0 && lastPosY <= elementH && lastPosX >= 0 && lastPosX <= elementW) {
          console.log('farTopLeft function');
          angular.element(element[0]).addClass('farTopLeft');
          angular.element(element[0]).removeClass('farTop');
          angular.element(element[0]).removeClass('farRight');
          angular.element(element[0]).removeClass('farLeft');
          var ftl = 'farTopLeft';
          PositionService.setClass(ftl);
        } else if (lastPosX >= 0 && lastPosX <= (elementW * 2) && lastPosY >= elementH) {
          console.log('farLeft function');
          angular.element(element[0]).addClass('farLeft');
          angular.element(element[0]).removeClass('farTop');
          angular.element(element[0]).removeClass('farRight');
          angular.element(element[0]).removeClass('farTopLeft');
          var fl = 'farLeft';
          PositionService.setClass(fl);
        } else{
          var normal = 'normal';
          PositionService.setClass(normal);
          angular.element($element[0]).removeClass('farTop');
          angular.element($element[0]).removeClass('farRight');
          angular.element($element[0]).removeClass('farLeft');
          angular.element($element[0]).removeClass('farTopLeft');
        }
      };

      ///////////////////////////// GESTURE ////////////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function onGesture
       * @description
       * Method to determine where the element is within the screen so that styling
       * and position can be returned
       *
       * @param  {Object}  e Event object param from onGesture function
       */
      $scope.onGesture = function (e) {
        $timeout(function () {
          var elementCount = PostItemService.retrieveElementCount();
          var elem = angular.element(e.target.offsetParent.children[elementCount].children[0]);
          var tagPos = $ionicPosition.position(elem);
          PositionService.setImagePosition(tagPos.left, tagPos.top);
          $scope.leftPosition = PositionService.getImagePositionX();
          $scope.topPosition = PositionService.getImagePositionY();
          checkPosition($scope.leftPosition, $scope.topPosition, e, elem);
        }, 600);
        function getPosition(element) {
          var xPosition = 0;
          var yPosition = 0;
          while(element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
          }
          return { x: xPosition, y: yPosition };
        }
        var canvasPosition = getPosition(event.gesture.touches[0].target);
        var tap = { x:0, y:0 };
        if(event.gesture.touches.length>0){
          var tt = event.gesture.touches[0];
          tap.x = tt.clientX || tt.pageX || tt.screenX ||0;
          tap.y = tt.clientY || tt.pageY || tt.screenY ||0;
        }
        $scope.positionX = tap.x - canvasPosition.x;
        $scope.positionY = tap.y - canvasPosition.y;
        PositionService.setPosition($scope.positionX, $scope.positionY);
      };

      /**
       * @ngdoc function
       * @function drag-end
       * @description
       * Determines the position of tag to return position to PositionService
       * and to apply css class depending on where it is on the screen
       */
      $scope.$on('drag-end', function () {
        $scope.items[$rootScope.itemSelect].leftPosition = PositionService.getImagePositionX();
        $scope.items[$rootScope.itemSelect].topPosition = PositionService.getImagePositionY();
        $scope.items[$rootScope.itemSelect].style = PositionService.getClass();
        $scope.$apply();
      });


      ///////////////////////////// SHOW TAGS SECTION //////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function backClick
       * @description
       * Shows tag modal if user clicks back button in autocomplete page
       */
      $scope.$on('backClick', function () {
        $scope.oModal2.show();
      });

      ///////////////////////////// SHOW TAGS SECTION //////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function startTag
       * @description
       * Toggle method to show or hide tags
       */
      $scope.startTag = function () {
        $scope.tagShow = !$scope.tagShow;
      };

      ///////////////////////////// GO BACK MODAL //////////////////////////////////////////////////////////////////////
      // Ionic modal directive for warning user about going
      $ionicModal.fromTemplateUrl('templates/views/modals/back-error.html', {
        id: '3',
        scope: $scope,
        cssClass: 'modal-styling',
        backdropClickToClose: false,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.oModal3 = modal;
      });

      ///////////////////////////// TAG ITEM MODAL /////////////////////////////////////////////////////////////////////
      // Ionic modal directive for tag icons
      $ionicModal.fromTemplateUrl('templates/views/modals/tag-icons.html', {
        id: '2',
        scope: $scope,
        cssClass: 'modal-styling',
        backdropClickToClose: false,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.oModal2 = modal;
      });

      ///////////////////////////// TITLE MODAL ////////////////////////////////////////////////////////////////////////
      // Ionic modal directive for image title
      $ionicModal.fromTemplateUrl('templates/views/modals/image-title.html', {
        id: '1',
        scope: $scope,
        cssClass: 'modal-styling',
        backdropClickToClose: false,
        animation: 'slide-in-up',
        focusFirstInput: true
      }).then(function (modal) {
        $scope.oModal1 = modal;
      });

      /**
       * @ngdoc function
       * @function openModal
       * @description
       * Open tag icon modal
       *
       * @param  {String}  index string index to pass which modal to be opened
       */
      $scope.openModal = function (index) {
        if (index == 1){
          $scope.oModal1.show();
        } else {
          $scope.oModal2.show();
        }
      };

      /**
       * @ngdoc function
       * @function closeModal
       * @description
       * Close tag icon modal
       *
       * @param  {String}  index string index to pass which modal to be opened
       */
      $scope.closeModal = function (index) {
        if (index == 1){
          $scope.oModal1.hide();
        } else {
          $scope.oModal2.hide();
        }
        PostItemService.removeItem();
        $scope.items.pop();
        count--;
      };

      /**
       * @ngdoc function
       * @function closeModalTitle
       * @description
       * Close image title modal
       *
       * @param  {String}  index string index to pass image title modal to close
       */
      $scope.closeModalTitle = function (index) {
        if (index == 1) {
          $scope.oModal1.hide();
        } else{
          $scope.oModal2.hide();
        }
      };


      ///////////////////////////// SELECT CLOTH ITEM //////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function addItemToggle
       * @description
       * Add item object to $scope.object
       *
       * @param  {Object}  object What object is selected from tag modal
       */
      $scope.addItemToggle = function (object) {
        $scope.oModal2.show();
        $scope.object = object;
      };

      /**
       * @ngdoc function
       * @function deleteItem
       * @description
       * Delete item object from $scope.object
       *
       * @param  {Object}  item What object is selected from tag modal
       * @param  {Object}  index What object is selected from tag modal
       */
      $scope.deleteItem = function (item, index) {
        item.$$hashKey = item.hashkey;
        angular.forEach($scope.mensClothing, function(obj){
          if (obj.$$hashKey === item.$$hashKey) {
            obj.disabled = false;
            obj.selected = false;
            return;
          }
        });
        angular.forEach($scope.womensClothing, function(obj){
          if (obj.$$hashKey === item.$$hashKey) {
            obj.disabled = false;
            obj.selected = false;
            return;
          }
        });
        $scope.items.splice(index, 1);
        PostItemService.removeItem();
        PostItemService.removeElementCount();
        count--;
      };

      /**
       * @ngdoc function
       * @function ToggleItem
       * @description
       * Toggle item object from $scope.object
       *
       * @param  {Object}  item What object is selected from tag modal
       * @param  {Object}  index What object is selected from tag modal
       */
      $scope.ToggleItem = function (item, index) {
        item.selected = true;
        if (item.selected) {
          $scope.object.itemName = item.itemName;
          $scope.object.itemIcon = item.itemIcon;
          $scope.object.selected = index;
          $scope.object.leftPosition = PositionService.getImagePositionX();
          $scope.object.topPosition = PositionService.getImagePositionY();
          $scope.object.style = PositionService.getClass();
          $scope.object.sex = item.sex;
          $scope.object.hashkey = item.$$hashKey;
        } else {
          $scope.object.itemName = '';
          $scope.object.itemIcon = '';
          $scope.object.selected = '';
        }
        $scope.oModal2.hide();
        $timeout(function () {
          PostItemService.addElementCount();
          var autoCompleteIndex = $scope.object.tag;
          var selectedItem = angular.element(document.getElementById('autocomplete_' + autoCompleteIndex));
          selectedItem.triggerHandler('click');
        }, 100);
      };

      ///////////////////////////// UPLOAD ITEM ////////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function upload
       * @description
       * Upload item using PostService
       *
       */
      $scope.upload = function () {
        $rootScope.isCameraBtnActive = false;
        var bottomNav = angular.element(document.querySelector('.footer-camera-icon'));
        if ($rootScope.isCameraBtnActive === true) {
          bottomNav.addClass('addCross');
        } else {
          bottomNav.removeClass('addCross');
        }
        $rootScope.imgURI = null;
        // Post image using post service
        PostService.postCameraUpload($scope.photoDetails.title, $scope.items);
        // Reset image back to null
        PostItemService.saveImage(null);
        // Reset items array
        $scope.items = PostItemService.resetItems();
        count = PostItemService.resetCount();
        $scope.photoDetails = {};
        // Go back to last viewed state
        var v = $ionicHistory.viewHistory();
        if (!v.backView) {
          $state.go(localStorageService.get('viewBeforeCamera'));
          $scope.oModal3.hide();
        } else {
          $ionicHistory.goBack();
          $scope.oModal3.hide();
        }
      };

      ///////////////////////////// AUTOCOMPLETE BRANDS ////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function getBrands
       * @description
       * Upload item using PostService
       *
       * @param  {Object} query Returns brands array
       */
      $scope.getBrands = function(query){
        return ClothingItems.returnBrands(query);
      };

      ///////////////////////////// CLOTHING ITEMS /////////////////////////////////////////////////////////////////////
      $scope.mensClothing = ClothingItems.returnMenItems();
      $scope.womensClothing = ClothingItems.returnWomenItems();

    }]);



