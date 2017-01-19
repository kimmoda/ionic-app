'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:MainProfileLikesController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Profile controller for the main profile section, data is 3-way bound
 *
 */

angular.module('Outfitpic.Controller.MainProfileLikes', [])
  .controller('MainProfileLikesController', ['$scope', '$rootScope', '$firebaseArray', '$ionicPopup', '$timeout', '$state',
              '$ionicScrollDelegate', 'FIREBASE_URL', 'ProfileService', 'UserCache', 'PostService', 'ImageCache', 'ToastService',
              'LOCATIONS', 'localStorageService', 'PopUpService', 'ScrollToService', 'CheckUserService', '$ionicHistory',
              'NavigationServices',
    function ($scope, $rootScope, $firebaseArray, $ionicPopup, $timeout, $state, $ionicScrollDelegate, FIREBASE_URL,
              ProfileService, UserCache, PostService, ImageCache, ToastService, LOCATIONS, localStorageService,
              PopUpService, ScrollToService, CheckUserService, $ionicHistory, NavigationServices) {

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


      /////////////////////////////// LIKES ADDED //////////////////////////////////////////////////////////////////////
      var startSize = 400;
      $rootScope.progress = startSize;
      var likedPostKeyRef = ProfileService.getLikesRef();
      var likedScrollRef = new Firebase.util.Scroll(likedPostKeyRef, 'date');
      $scope.likedItems = $firebaseArray(likedScrollRef);
      likedScrollRef.scroll.next(2);
      $scope.noMoreLikeItems = false;
      $scope.likesCount = 0;
      $scope.likesUnknown = true;

      /**
       * @ngdoc function
       * @function loadMoreLikes
       * @description
       * Infinite scroll function to load more items when user gets to the bottom fo the screen
       *
       */
      $scope.loadMoreLikes = function () {
        likedScrollRef.scroll.next(2);
        if ($scope.likesUnknown) {
          ProfileService.calculateLikesLength(function (amount) {
            $scope.likesCount = amount;
            $scope.likesUnknown = false;
          });
          var calSize = startSize + 400;
          $rootScope.progress = calSize;
          startSize = calSize;
        } else if ($scope.likedItems.length == $scope.likesCount) {
          $scope.noMoreLikesPlaceholder = true;
          $scope.noMoreLikeItems = true;
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

      ///////////////////////////////// VIEW USER PROFILE OF IMAGE /////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function viewUser
       * @description
       * Open state to view user profile of image posted
       *
       * @param  {String}  userId User ID of the person selected
       */
      $scope.viewUser = function (userId) {
        if(userId != $scope.userId) {
          NavigationServices.viewUserState(viewHistory, userId);
        }
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

      /////////////////////////////// ADDS ACTIVE CLASS TO ICONS /////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function checkIfUserHasHung
       * @description
       * Function called to see if the user has added already added item to their wardrobe
       *
       * @param  {Object}  wardrobeItem Item object
       * @param  {Object}  post Post object
       */
      $scope.checkIfUserHasHung = function (wardrobeItem, post) {
        // Check user service to return true if user has hung in wardrobe before
        return CheckUserService.checkIfUserHasHung(wardrobeItem, $scope.userId, post.$id);
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
       * @function deleteItem
       * @description
       * Close delete screen
       *
       * @param  {Object}  itemKey Item object selected
       */
      $scope.deleteItem = function (itemKey) {
        var urlString = '/likedPost/';
        PostService.deleteUserItems($scope.userId, itemKey, 2, urlString);
      };

    }
  ]).filter('isEmpty', [
  function () {
    return function (object) {
      return angular.equals({}, object);
    };
  }
]);
