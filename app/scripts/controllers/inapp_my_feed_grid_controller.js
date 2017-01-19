'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:NewsGridController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc controller
 * @description News grid showing latest trends and image posts
 *
 */

angular.module('Outfitpic.Controller.MyFeedGrid', [])
  .controller('MyFeedGridController', ['$scope', '$rootScope', '$ionicGesture', '$firebaseArray', '$firebaseAuth',
              '$firebaseObject', '$timeout', '$state', '$ionicFilterBar', 'FIREBASE_URL', 'NewsFeed', 'UserCache',
              'PostService', '$http', 'ProfileService', 'UserLevel', '$ionicScrollDelegate', '$ionicModal', 'ShareData',
              'ImageCache', 'LOCATIONS', '$ionicPopup', 'ToastService', 'localStorageService', '$ionicHistory',
              'PopUpService', 'ScrollToService', 'CheckUserService', 'NavigationServices',
  function ($scope, $rootScope, $ionicGesture, $firebaseArray, $firebaseAuth, $firebaseObject, $timeout,
            $state, $ionicFilterBar, FIREBASE_URL, NewsFeed, UserCache, PostService, $http, ProfileService,
            UserLevel, $ionicScrollDelegate, $ionicModal, ShareData, ImageCache, LOCATIONS, $ionicPopup, ToastService,
            localStorageService, $ionicHistory, PopUpService, ScrollToService, CheckUserService, NavigationServices) {

    /////////////////////////////// GET HISTORY STACK //////////////////////////////////////////////////////////////////
    // Get ionic history stack
    var viewHistory = $ionicHistory.viewHistory();

    //////////////////////// USER LEVEL DETECTION //////////////////////////////////////////////////////////////////////
    // Checks the user level allowing to show tutorials on pages
    UserLevel.checkUserLevel();

    /////////////////////////////// GET USER ID ////////////////////////////////////////////////////////////////////////
    // Check if there is a userId string within local storage
    $scope.userId = localStorageService.get('userId');
    // If no angular local storage string is available call ProfileService to retrieve one and save in local storage
    if($scope.userId === null){
      $scope.userId = ProfileService.getProfileId();
      localStorageService.set('userId', $scope.userId);
    }

    //////////////////////// SET ROOT STATE ////////////////////////////////////////////////////////////////////////////
    // Sets the root state within local storage
    localStorageService.set('rootState', $state.current.name);

    ///////////////////////////// BACK TO PREVIOUS /////////////////////////////////////////////////////////////////////
    /**
     * @ngdoc function
     * @name checkHistory
     * @description
     * This method checks if user has $ionicHistory stack
     * and if page has been hard refreshed
     */
    var checkHistory = function() {
      var v = $ionicHistory.viewHistory();
      if (v.backView !== null && v.backView.stateName == LOCATIONS.MYFEEDIMAGE) {
        $scope.showBackButton = function () {
          return true;
        };
      }
    };
    checkHistory();

    /////////////////////////////// GRID TOGGLE ////////////////////////////////////////////////////////////////////////
    // $scope variable for grid toggle button
    $scope.isGridActive = true;

    /**
     * @ngdoc function
     * @name changeGridToggle
     * @description
     * Toggle method for grid expanded and condensed view
     */
    $scope.changeGridToggle = function () {
      $scope.isGridActive = !$scope.isGridActive;
    };

    /////////////////////////////// INFINITE LIST //////////////////////////////////////////////////////////////////////
    var baseRef = PostService.getMyTimeline();
    var scrollRef = new Firebase.util.Scroll(baseRef, 'createdAt');
    $scope.items = $firebaseArray(scrollRef);
    scrollRef.scroll.next(2);
    $scope.noMoreItemsAvailable = false;
    $scope.count = 0;
    $scope.isListAmountUnknown = true;

    /**
     * @ngdoc function
     * @function loadMore
     * @description
     * Infinite scroll function to load more items when user gets to the bottom fo the screen
     *
     */
    $scope.loadMore = function () {
      $scope.loadMoreItems = true;
      scrollRef.scroll.next(3);
      if ($scope.isListAmountUnknown) {
        var length = PostService.calculateTimelineLength(function (amount) {
          $scope.count = amount;
          $scope.isListAmountUnknown = false;
        });
      } else {
        if ($scope.items.length == $scope.count) {
          $scope.noMorePlaceholder = true;
          $scope.noMoreItemsAvailable = true;
        }
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };


    ///////////////////////////// ATTACH AVATAR PROFILES ///////////////////////////////////////////////////////////////
    /**
     * @ngdoc service
     * @description
     * User cache service from ng-init function attaching user profiles to the post
     *
     */
    $scope.users = UserCache.getCachedUserProfiles();

    ///////////////////////////// ATTACH IMAGES ////////////////////////////////////////////////////////////////////////
    /**
     * @ngdoc service
     * @description
     * Image cache service from ng-init function attaching uimage to item
     *
     */
    $scope.images = ImageCache.getCachedImageProfiles();

    /////////////////////////////// UP VOTE ////////////////////////////////////////////////////////////////////////////
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

    /////////////////////////////// ADD TO WARDROBE SYSTEM /////////////////////////////////////////////////////////////
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

    /////////////////////////////// FUNCTION WHEN USER CLICKS CHAT ICON ////////////////////////////////////////////////
    $rootScope.commentsShow = false;
    /**
     * @ngdoc function
     * @function changeState
     * @description
     * Opens image item and scrolls to comments of the image
     *
     * @param  {Object}  post Post object of item
     */
    $scope.changeState = function (post) {
      $state.go(LOCATIONS.MYFEEDIMAGE, {group_id: post.$id});
      $scope.$on('$stateChangeSuccess',
        function onStateSuccess() {
          $rootScope.commentsShow = true;
          // Scroll to comments input field service
          ScrollToService.commentsScroll();
        }
      );
    };

    ///////////////////////////////// VIEW USER PROFILE OF IMAGE ///////////////////////////////////////////////////////
    /**
     * @ngdoc function
     * @function viewUser
     * @description
     * Open state to view user profile of image posted
     *
     * @param  {String}  userId User ID of the person selected
     */
    $scope.viewUser = function (userId) {
      NavigationServices.viewUserState(viewHistory, userId);
    };

    ///////////////////////////////// VIEW IMAGE SELECTED //////////////////////////////////////////////////////////////
    /**
     * @ngdoc function
     * @function viewImage
     * @description
     * Open image selected from grid section
     *
     * @param  {String}  imageId Image ID of item selected
     */
    $scope.viewImage = function (imageId) {
      $state.go(LOCATIONS.MYFEEDIMAGE, {group_id: imageId});
      localStorageService.set('imageId', imageId);
      localStorageService.set('previousState', $state.current.name);
    };

    /////////////////////////////// ADDS ACTIVE CLASS TO ICONS /////////////////////////////////////////////////////////
    /**
     * @ngdoc function
     * @function checkIfUserHasLiked
     * @description
     * Function called to see if the user has liked the post previously and then returning a css
     * class as active on the icon if user returns true
     *
     * @param  {Object}  upVote Image object of item
     * @param  {Object}  post Post object
     */
    $scope.checkIfUserHasLiked = function (upVote, post) {
      // Check user service to return true if user has liked before
      return CheckUserService.checkIfUserHasLiked(upVote, $scope.userId, post.$id);
    };

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

    /////////////////////////////////// SCROLL TO TOP BUTTON ///////////////////////////////////////////////////////////
    /**
     * @ngdoc function
     * @function scrollToTop
     * @description
     * Scroll to top function. Appears only when user has scrolled from the top
     *
     */
    $scope.scrollToTop = function() {
      $ionicScrollDelegate.scrollTop(true);
    };

    /**
     * @ngdoc function
     * @function gotScrolled
     * @description
     * Scroll detection script to determine if user has scrolled and add class on up arrow icon
     *
     */
    $scope.gotScrolled = function() {
      var scrollPos = $ionicScrollDelegate.getScrollPosition().top;
      if(scrollPos > 0) {
        angular.element(document.getElementById('top-button')).addClass('back-top-top-anim');
      } else{
        angular.element(document.getElementById('top-button')).removeClass('back-top-top-anim');
      }
    };


    ///////////////////////////// POST COMMENTS ////////////////////////////////////////////////////////////////////////
    $scope.commentsObj = {};
    /**
     * @ngdoc function
     * @name addComment
     * @description
     * Post comments function
     *
     * @param {String} comment string to pass to CommentService.
     * @param {Object} post object to pass to CommentService.
     * @param {Object} user object to pass to CommentService.
     */
    $scope.addComment = function (comment, post, user) {
      PostService.postComments(comment, post.$id, user);
      $scope.commentsObj.text = '';
    };

    ///////////////////////////// DELETE ITEMS IN MY GRID //////////////////////////////////////////////////////////////
    /**
     * @ngdoc function
     * @function showDeleteScreen
     * @description
     * Show delete screen when user hold on to image using ionic gesture
     *
     * @param  {Object}  item Item object selected
     */
    $scope.imageDeleteKey = '';
    $scope.showDeleteScreen = function (item) {
      $scope.imageDeleteKey = item.$id;
    };

    /**
     * @ngdoc function
     * @function removeDeleteScreen
     * @description
     * Close delete screen
     *
     */
    $scope.removeDeleteScreen = function () {
      $scope.imageDeleteKey = false;
    };

    /**
     * @ngdoc function
     * @function deleteItem
     * @description
     * Close delete screen
     *
     */
    $scope.deleteItem = function (itemKey) {
      PostService.deleteUserItems($scope.userId, itemKey, 3);
    };


  }]);
