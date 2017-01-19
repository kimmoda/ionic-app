'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:DiscoveryGridController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc controller
 * @description Items grid showing data relevant to selection from the item
 *              feed controller
 *
 */

angular.module('Outfitpic.Controller.DiscoveryGrid', [])
  .controller('DiscoveryGridController', ['$scope', '$rootScope', '$firebaseArray', '$timeout', '$state', '$stateParams',
              '$ionicFilterBar', 'FIREBASE_URL', 'UserCache', 'PostService', '$http', 'ProfileService',
              '$ionicScrollDelegate', '$ionicModal', 'MasterDataService', 'FriendsService', 'LOCATIONS',
              'localStorageService', '$ionicHistory', 'PopUpService', 'UserLevel', '$ionicPopup', '$location',
              'ScrollToService', 'CheckUserService', 'NavigationServices',
    function ($scope, $rootScope, $firebaseArray, $timeout, $state, $stateParams, $ionicFilterBar, FIREBASE_URL, UserCache,
              PostService, $http, ProfileService, $ionicScrollDelegate, $ionicModal, MasterDataService, FriendsService,
              LOCATIONS, localStorageService, $ionicHistory, PopUpService, UserLevel, $ionicPopup, $location, ScrollToService,
              CheckUserService, NavigationServices) {

      /////////////////////////////// GET HISTORY STACK ////////////////////////////////////////////////////////////////
      // Get ionic history stack
      var viewHistory = $ionicHistory.viewHistory();

      //////////////////////// USER LEVEL DETECTION ////////////////////////////////////////////////////////////////////
      // Checks the user level allowing to show tutorials on pages
      UserLevel.checkUserLevel();

      ///////////////////////////// BACK TO PREVIOUS ///////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function showBackButton
       * @description
       * Ng-if declaration to show back button. Is hidden if the page has been had refreshed
       *
       */
      $scope.showBackButton = function(){
        return false;
      };

      /**
       * @ngdoc function
       * @name checkHistory
       * @description
       * This method checks if user has $ionicHistory stack
       * and if page has been hard refreshed
       */
      var checkHistory = function() {
        var v = $ionicHistory.viewHistory();
        if (!v.backView) {
          $scope.showBackButton = function () {
            return true;
          };
          $scope.showTempBackButton = true;
          $scope.myGoBack = function () {
            $state.go(localStorageService.get('rootState'));
          };
        } else if (
          v.backView.stateName == LOCATIONS.DISCOVERIMAGE ||
          v.backView.stateName == LOCATIONS.DISCOVERUSERPROFILEWARDROBE ||
          v.backView.stateName == LOCATIONS.DISCOVERUSERPROFILEOUTFITS ||
          v.backView.stateName == LOCATIONS.DISCOVERUSERPROFILELIKES) {
          $scope.showBackButton = function () {
            return true;
          };
          $scope.showTempBackButton = true;
          $scope.myGoBack = function () {
            $state.go(localStorageService.get('rootState'));
          };
        }
      };
      checkHistory();

      /////////////////////////////// GRID TOGGLE //////////////////////////////////////////////////////////////////////
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

      /////////////////////////////// GET USER ID //////////////////////////////////////////////////////////////////////
      // Check if there is a userId string within local storage
      $scope.userId = localStorageService.get('userId');
      // If no angular local storage sting is available call ProfileService to retrieve one and save in local storage
      if($scope.userId === null){
        $scope.userId = ProfileService.getProfileId();
        localStorageService.set('userId', $scope.userId);
      }

      ///////////////////////////////// ID OF ITEMS FEED /////////////////////////////////////////////////////////
      var id = $stateParams.grid_feed_id;
      if(!id){
        // If no id is available access it from local storage
        id = localStorageService.get('gridId');
      }
      // Get feed data from Firebase master data service
      var feed = MasterDataService.getFeedObject(id);
      feed.$loaded().then(function (data) {
        $scope.navTitle = data.title;
        $scope.dataSort = data.sortDataKey;
      }).catch(function (error) {
        PopUpService.errorPopup(error);
      });


      ///////////////////////////////// INFINITE LIST //////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function dataSort
       * @description
       * Retrives the key that the news feed should be sorted by and then passes it into the scroll Util method
       * for infinite scrolling
       *
       */
      $scope.$watch('dataSort', function() {
        if($scope.dataSort){
          var baseRef = PostService.getPosts();
          $scope.scrollRef = new Firebase.util.Scroll(baseRef, $scope.dataSort);
          $scope.items = $firebaseArray($scope.scrollRef);
          $scope.scrollRef.scroll.next(2);
          $scope.noMoreItemsAvailable = false;
          $scope.count = 0;
          $scope.isListAmountUnknown = true;
          $scope.loadMore();
        }
      });

      /**
       * @ngdoc function
       * @function loadMore
       * @description
       * Infinite scroll function to load more items when user gets to the bottom fo the screen
       *
       */
      $scope.loadMore = function () {
        $scope.loadMoreItems = true;
        if($scope.dataSort){
          $scope.scrollRef.scroll.next(3);
          if ($scope.isListAmountUnknown) {
            PostService.calculatePostLength(function (amount) {
              $scope.count = amount;
              $scope.isListAmountUnknown = false;
            });
          } else {
            if ($scope.items.length == $scope.count) {
              $scope.noMorePlaceholder = true;
              $scope.noMoreItemsAvailable = true;
            }
          }
          $timeout(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        }

      };

      /////////////////////////////// ATTACH AVATAR PROFILES ///////////////////////////////////////////////////////////
      /**
       * @ngdoc service
       * @description
       * User cache service from ng-init function attaching user profiles to the post
       *
       */
      $scope.users = UserCache.getCachedUserProfiles();

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

      ///////////////////////////////// FUNCTION WHEN USER CLICKS CHAT ICON ////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function viewCommentsList
       * @description
       * Opens image item and scrolls to comments of the image
       *
       * @param  {Object}  post Post object of item
       */
      $rootScope.commentsShow = false;
      $scope.viewCommentsList = function (post) {
        NavigationServices.viewCommentsList(viewHistory, post.$id);
        $scope.$on('$stateChangeSuccess',
          function onStateSuccess() {
            $rootScope.commentsShow = true;
            // Scroll to comments input field service
            ScrollToService.commentsScroll();
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
        if(userId != $scope.userId){
          NavigationServices.viewUserState(viewHistory, userId);
        }
      };

      ///////////////////////////////// VIEW IMAGE SELECTED ////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function viewImage
       * @description
       * Open image selected from grid section
       *
       * @param  {String}  postObj Image ID of item selected
       */
      $scope.viewImage = function (postObj) {
        NavigationServices.viewImageState(viewHistory, postObj);
      };

      ///////////////////////////////// ADDS ACTIVE CLASS TO ICONS /////////////////////////////////////////////////////
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

      ///////////////////////////////////// SCROLL TO TOP BUTTON ///////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function scrollToTop
       * @description
       * Scroll to top function. Arrow appears only when user has scrolled from the top within news feed
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

      /////////////////////////////// POST COMMENTS ////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name addComment
       * @description
       * Post comments function
       *
       * @param {String} comment string to pass to CommentService.
       * @param {Object} post string to pass to CommentService.
       * @param {Object} user string to pass to CommentService.
       */
      $scope.commentsObj = {};
      $scope.addComment = function (comment, post, user) {
        PostService.postComments(comment, post.$id, user);
        $scope.commentsObj.text = '';
      };

      ///////////////////////////////// REQUEST FRIEND /////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name addFriend
       * @description
       * Show popover showing request user friend request
       *
       * @param {String} postUserId User id belonging to the post
       */
      $scope.addFriend = function(postUserId){
        // popup service add user method
        PopUpService.addUser(postUserId);
      };

      /**
       * @ngdoc function
       * @name checkIfUserHasBeenAdded
       * @description
       * Check if user has been sent a friend request already or has been added as a friend
       *
       * @param {Object} postUser User object belong to the post
       */
      $scope.checkIfUserHasBeenAdded = function (postUser) {
        // Check user service to return true if user has been added before
        return CheckUserService.checkIfUserHasBeenAdded(postUser.$id, $scope.userId);
      };


    }]);
