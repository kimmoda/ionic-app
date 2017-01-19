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
 * @description Profile controller on liked outfits for the selected user
 *
 */

angular.module('Outfitpic.Controller.SelectedUserLikes', [])
  .controller('SelectedUserLikesController', ['$scope', '$rootScope', '$firebaseArray', '$ionicPopup', '$timeout',
              '$state', '$ionicScrollDelegate', 'FIREBASE_URL', 'ProfileService', 'UserCache', 'PostService',
              'ImageCache', 'ToastService', 'LOCATIONS', 'localStorageService', 'PopUpService', '$stateParams',
              'FriendsService', '$ionicHistory', 'NavigationServices', 'ScrollToService', 'CheckUserService',
    function ($scope, $rootScope, $firebaseArray, $ionicPopup, $timeout, $state, $ionicScrollDelegate, FIREBASE_URL,
              ProfileService, UserCache, PostService, ImageCache, ToastService, LOCATIONS, localStorageService,
              PopUpService, $stateParams, FriendsService, $ionicHistory, NavigationServices, ScrollToService,
              CheckUserService) {

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



      /////////////////////////////// STATE ID OF USER /////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @description
       * Checked if user has hard refreshed. If true they get userId from local storage
       *
       */
      $scope.selectedUserId = $stateParams.user_id;
      if(!$scope.selectedUserId){
        $scope.selectedUserId = localStorageService.get('profileUserId');
      }

      /////////////////////////////// LIKES ADDED //////////////////////////////////////////////////////////////////////
      var startSize = 400;
      $rootScope.progress = startSize;
      var likedPostKeyRef = ProfileService.getUserLikesRef($scope.selectedUserId);
      var likedScrollRef = new Firebase.util.Scroll(likedPostKeyRef, 'date');
      $scope.likedItems = $firebaseArray(likedScrollRef);
      likedScrollRef.scroll.next(4);
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
        likedScrollRef.scroll.next(4);
        if ($scope.likesUnknown) {
          ProfileService.calculateUserLikesLength(function (amount) {
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
       * @param  {String}  likesKey Image ID of item selected
       */
      $scope.viewImage = function (likesKey) {
        NavigationServices.viewImageState(viewHistory, likesKey);
      };

      ///////////////////////////////// FUNCTION WHEN USER CLICKS CHAT ICON ////////////////////////////////////////////
      $rootScope.commentsShow = false;
      /**
       * @ngdoc function
       * @function viewCommentsList
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

      ///////////////////////////// CHECK IF USER IS ON FRIENDS LIST ///////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name checkIfUserIsFriend
       * @description
       * Check if user is on friend list. If not then user is prohibited from seeing their posts
       *
       * @param  {Object}  selectedUsrObj Selected user object
       */
      $scope.checkIfUserIsFriend = function (selectedUsrObj) {
        return CheckUserService.checkIfUserIsFriend(selectedUsrObj.$id, $scope.userId);
      };

    }
  ]).filter('isEmpty', [
  function () {
    return function (object) {
      return angular.equals({}, object);
    };
  }
]);
