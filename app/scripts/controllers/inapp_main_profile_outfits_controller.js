'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:MainProfileOutfitsController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Profile controller for the main profile section, data is 3-way bound
 *
 */

angular.module('Outfitpic.Controller.MainProfileOutfits', [])
  .controller('MainProfileOutfitsController', ['$scope', '$rootScope', '$firebaseArray', '$ionicPopup', '$timeout', '$state',
              '$ionicScrollDelegate', 'FIREBASE_URL', 'ProfileService', 'UserCache', 'PostService', 'ImageCache', 'ToastService',
              'LOCATIONS', 'localStorageService', 'PopUpService', 'ScrollToService', 'NavigationServices', '$ionicHistory',
    function ($scope, $rootScope, $firebaseArray, $ionicPopup, $timeout, $state, $ionicScrollDelegate, FIREBASE_URL,
              ProfileService, UserCache, PostService, ImageCache, ToastService, LOCATIONS, localStorageService,
              PopUpService, ScrollToService, NavigationServices, $ionicHistory) {

      /////////////////////////////// GET HISTORY STACK ////////////////////////////////////////////////////////////////
      // Get ionic history stack
      var viewHistory = $ionicHistory.viewHistory();

      /////////////////////////////// GET USER ID //////////////////////////////////////////////////////////////////////
      // Check if there is a userId string within local storage
      $scope.userId = localStorageService.get('userId');
      // If no angular local storage sting is available call ProfileService to retrieve one and save in local storage
      if($scope.userId === null){
        $scope.userId = ProfileService.getProfileId();
        localStorageService.set('userId', $scope.userId);
      }


      /////////////////////////////// SHOW BACK ARROW //////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name checkHistory
       * @description
       * This method checks if user has $ionicHistory stack
       * and if page has been hard refreshed
       */
      $scope.hideBackButton = false;
      var currentState = $state.current.name;

      var checkHistory = function() {
        if(viewHistory.backView === null){
          $scope.hideBackButton = true;
          $scope.showTempBackButton = true;
          $scope.myGoBack = function () {
            NavigationServices.goBackFunction(viewHistory, currentState);
          };
        } else if(NavigationServices.checkBackState(viewHistory)){
          $scope.hideBackButton = true;
          $scope.showTempBackButton = true;
          $scope.myGoBack = function () {
            NavigationServices.goBackFunction(viewHistory, currentState);
          };
        }

      };
      checkHistory();
      /////////////////////////////// OUTFITS ADDED ////////////////////////////////////////////////////////////////////
      var startSize = 400;
      $rootScope.progress = startSize;
      var outfitsKeyRef = ProfileService.getOutfitsRef();
      var outfitsScrollRef = new Firebase.util.Scroll(outfitsKeyRef, 'date');
      $scope.userOutfits = $firebaseArray(outfitsScrollRef);
      outfitsScrollRef.scroll.next(2);
      $scope.noMoreUserOutfitItems = false;
      $scope.userOutfitCount = 0;
      $scope.userOutfitUnknown = true;
      /**
       * @ngdoc function
       * @function loadMoreOutfits
       * @description
       * Infinite scroll function to load more items when user gets to the bottom fo the screen
       *
       */
      $scope.loadMoreOutfits = function () {
        outfitsScrollRef.scroll.next(2);
        if ($scope.userOutfitUnknown) {
          ProfileService.calculateOutfitsLength(function (amount) {
            $scope.userOutfitCount = amount;
            $scope.userOutfitUnknown = false;
          });
          var calSize = startSize + 400;
          $rootScope.progress = calSize;
          startSize = calSize;
        } else if ($scope.userOutfits.length == $scope.userOutfitCount) {
          $scope.noMoreUserOutfitPlaceholder = true;
          $scope.noMoreUserOutfitItems = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      ///////////////////////////////// VIEW IMAGE SELECTED ////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function viewImage
       * @description
       * Open image selected from grid section
       *
       * @param  {String}  postObj Post object
       */
      $scope.viewImage = function (postObj) {
        NavigationServices.viewImageState(viewHistory, postObj);
      };

      ///////////////////////////////// FUNCTION WHEN USER CLICKS CHAT ICON ////////////////////////////////////////////
      $rootScope.commentsShow = false;
      /**
       * @ngdoc function
       * @function changeState
       * @description
       * Opens image item and scrolls to comments of the image
       *
       * @param  {Object}  post Post object of item
       */
      $scope.viewCommentsList = function (post) {
        NavigationServices.viewCommentsList(viewHistory, post.$id);
        $scope.$on('$stateChangeSuccess',
          function onStateSuccess() {
            $rootScope.commentsShow = true;
          }
        );
      };

      /////////////////////////////////// UP VOTE //////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function upVote
       * @description
       * Upvote toggle function to increase likes and to add to users profile
       *
       * @param  {Object}  post Post object of item upvoted
       * @param  {Object}  postUser User object of the user who upvoted
       */
      $scope.upVote = function (post, postUser) {
        PostService.likeToggle(post, postUser);
      };

      ///////////////////////////////// ADD TO WARDROBE SYSTEM /////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function addToWardrobe
       * @description
       * Add to wardrobe toggle function to increase wardobe counter and to add item to user profile
       *
       * @param  {Object}  post Post object of item upvoted
       * @param  {Object}  postUser User object of the user who upvoted
       */
      $scope.addToWardrobe = function (post, postUser) {
        PostService.toggleWardrobe(post, postUser);
        PostService.getOwnWardrobe(function (amount) {
          return amount;
        });
      };

      ///////////////////////////// ATTACH AVATAR PROFILES /////////////////////////////////////////////////////////////
      /**
       * @ngdoc service
       * @description
       * User cache service from ng-init function attaching user profiles to the post
       *
       */
      $scope.users = UserCache.getCachedUserProfiles();

      ///////////////////////////// ATTACH IMAGES //////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc service
       * @description
       * Image cache service from ng-init function attaching uimage to item
       *
       */
      $scope.imageCache = ImageCache.getCachedImageProfiles();

      ///////////////////////////// DELETE PROFILE ITEMS ///////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function showDeleteScreen
       * @description
       * Show delete screen when user hold on to image using ionic gesture
       *
       * @param  {Object}  item Item object selected
       */
      $rootScope.imageDeleteKey = '';
      $scope.showDeleteScreen = function (item) {
        $rootScope.imageDeleteKey = item;
      };
      /**
       * @ngdoc function
       * @function removeDeleteScreen
       * @description
       * Close delete screen
       *
       */
      $scope.removeDeleteScreen = function () {
        $rootScope.imageDeleteKey = false;
      };


      /**
       * @ngdoc function
       * @name closeModal
       * @description
       * Close modal function
       */
      $scope.closeModal = function () {
        $scope.oModal1.hide();
      };

      /**
       * @ngdoc function
       * @function deleteItem
       * @description
       * Close delete screen
       *
       * @param  {Object}  itemKey Item object selected
       */
      $scope.deleteItem = function (itemKey) {
        PostService.deleteUserItems($scope.userId, itemKey, 1);
      };

    }
  ]).filter('isEmpty', [
  function () {
    return function (object) {
      return angular.equals({}, object);
    };
  }
]);
