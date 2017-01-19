'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:SelectedImageController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Controller to show the details of image once user selects from a list,
 *              currently used on main profile section
 *
 */

angular.module('Outfitpic.Controller.SelectedImage', [])
  .controller('SelectedImageController', ['$scope', '$state', '$stateParams', '$firebaseArray', '$ionicHistory',
              '$cordovaSocialSharing', 'UserImages', 'FIREBASE_URL', 'ProfileService', 'UserCache',
              'ShareData', 'PostService', '$ionicPopup', '$ionicScrollDelegate', 'User', 'LOCATIONS', '$timeout',
              'localStorageService', 'FriendsService', 'CommentService', 'PopUpService', 'UserLevel', 'ScrollToService',
              'NavigationServices', '$sce',
    function ($scope, $state, $stateParams, $firebaseArray, $ionicHistory, $cordovaSocialSharing, UserImages,
              FIREBASE_URL, ProfileService, UserCache, ShareData, PostService, $ionicPopup, $ionicScrollDelegate, User,
              LOCATIONS,  $timeout, localStorageService, FriendsService, CommentService, PopUpService, UserLevel,
              ScrollToService, NavigationServices, $sce) {

      /////////////////////////////// GET HISTORY STACK ////////////////////////////////////////////////////////////////
      // Get ionic history stack
      var viewHistory = $ionicHistory.viewHistory();

      //////////////////////// USER LEVEL DETECTION ////////////////////////////////////////////////////////////////////
      // Checks the user level allowing to show tutorials on pages
      UserLevel.checkUserLevel();

      ///////////////////////////// VARIABLES //////////////////////////////////////////////////////////////////////////
      var ref = UserImages;
      var id = $stateParams.group_id;
      ShareData.saveImageId(id);
      // Show loading spinner
      $scope.imageHasLoaded = false;

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

      ///////////////////////////// SOCIAL MEDIA SHARE /////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name shareAnywhere
       * @description
       * Share function from Cordova sharing plugin
       */
      $scope.shareAnywhere = function () {
        $cordovaSocialSharing.share('This is your message', 'This is your subject', null, 'http://blog.nraboy.com');
      };


      ///////////////////////////// GET IMAGE FUNCTION /////////////////////////////////////////////////////////////////
      var picture = $firebaseArray(ref);
      picture.$loaded().then(function (picture) {
        $scope.post = picture.$getRecord(id);
        // If user hard refreshes then this function is called
        if(!$scope.post){
          id = localStorageService.get('imageId');
          $scope.post = picture.$getRecord(id);
        }
        $scope.imgPostUrl = 'data:image/jpeg;base64,' + $scope.post.image;
        $scope.imageHasLoaded = true;
        $scope.tags = $scope.post.tags;
        $scope.user = User.getUserData($scope.post.user);
        ShareData.saveImageUser($scope.user);
        ShareData.saveImageTitle($scope.post.itemTitle);
        $scope.navTitle = ShareData.retrieveImageData().imageTitle;
        $timeout(function () {
          $scope.containerWidth = document.getElementById('image-holder').offsetWidth;
          $scope.containerHeight = document.getElementById('image-holder').offsetHeight;
          console.log($scope.containerHeight)
          $scope.orgContainerWidth = $scope.post.origWidth;
          $scope.orgContainerHeight = $scope.post.origHeight;
        }, 800);
        var itemsRef = PostService.getCommentsRef(id);
        $scope.comments = $firebaseArray(itemsRef);
        ShareData.saveComments($scope.comments);

      }).catch(function (error) {
        PopUpService.errorPopup(error);
      });


      ///////////////////////////// COMMENTS ARRAY /////////////////////////////////////////////////////////////////////
      // Return comments array from Firebase
      var itemsRef = PostService.getCommentsRef(id);
      $scope.comments = $firebaseArray(itemsRef);
      ShareData.saveComments($scope.commentsArray);

      ///////////////////////////// SHOW TAGS & COMMENTS ///////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name showTags
       * @description
       * Show tags function which reveal tag positions on screen
       */
      $scope.showTags = function () {
        $scope.tagShow = !$scope.tagShow;
      };

      /**
       * @ngdoc function
       * @name showComments
       * @description
       * Show comments array of image object
       */
      $scope.showComments = function () {
        $scope.commentsShow = !$scope.commentsShow;
        if($scope.commentsShow){
          $timeout(function() {
            // Scroll to comments input field service
            ScrollToService.commentsScroll();
          }, 0);
        } else{
          $timeout(function() {
            // Scroll back to top
            $ionicScrollDelegate.scrollTo(0, 0, true);
          }, 0);
        }
      };


      /////////////////////////////// TAG USER IN COMMENT //////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name tagUserInPost
       * @description
       * Listen to keypress event of app button and then show friends list
       *
       * @param {Object} keyEvent key event paramater from ng-pressed
       */
      $scope.tagUserInPost = function(keyEvent) {
        if (keyEvent.which === 64){
          $scope.showFriendsList = true;
          var friendsRef = FriendsService.getMyFriendsRef();
          var friendScrollRef = new Firebase.util.Scroll(friendsRef, 'date');
          $scope.userFriends = $firebaseArray(friendScrollRef);
          friendScrollRef.scroll.next(10);
        }
      };

      /**
       * @ngdoc function
       * @name addUserToComment
       * @description
       * Add user to the comment post
       *
       * @param {Object} usrObj User object of the user tagged in post
       */
      $scope.addUserToComment = function(usrObj){
        $scope.showFriendsList = false;
        $scope.image.comments = $scope.image.comments + usrObj.username +  ' ';
        $scope.whereIsBegin = $scope.image.comments.indexOf('@');
        $scope.whereIsEnd = usrObj.username.length;
        $scope.isOpen = true;
        $scope.userHasBeenTagged = true;
        $scope.taggedUserId = usrObj.$id
      };


      ///////////////////////////// POST COMMENTS //////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name addComment
       * @description
       * Post comments function
       *
       * @param {String} comment string to pass to CommentService.
       */
      $scope.image = {};
      $scope.addComment = function (comment) {
        // If user has been tagged in post
        if($scope.userHasBeenTagged){
          // Prototype function to find where @ sign is within string
          String.prototype.insertTextAtIndices = function(text) {
            return this.replace(/./g, function(character, index) {
              return text[index] ? text[index] + character : character;
            });
          };
          // char search to add html tags within comment string
          var beginning = $scope.whereIsBegin;
          var end = $scope.whereIsEnd + 1;
          var text = {};
          text[beginning] = '<span>';
          text[end] = '</span>';

          // Var commentStr to place html in correct indices
          var commentStr = comment.insertTextAtIndices(text);

          // Post comments with user tag in it
          CommentService.postCommentsWithUser(commentStr, id, $scope.user, $scope.taggedUserId);
          $scope.image.comments = '';
        } else{
          // Post normal comment without no one tagged
          CommentService.postComments(comment, id, $scope.user);
          $scope.image.comments = '';
        }
      };

      /**
       * @ngdoc function
       * @name showAllComments
       * @description
       * Show all comments of the image post
       *
       */
      $scope.showAllComments = function(){
        localStorageService.set('previousState', $state.current.name);
        var previousState = localStorageService.get('lastView');
        if(previousState == LOCATIONS.DISCOVERIMAGE){
          $state.go(LOCATIONS.DISCOVERIMAGECOMMENTS);
        } else if(previousState == LOCATIONS.MYFEEDIMAGE){
          $state.go(LOCATIONS.MYFEEDCOMMENTS);
        } else if(previousState == LOCATIONS.NOTIFICATIONIMAGE){
          $state.go(LOCATIONS.NOTIFICATIONCOMMENTS);
        } else if(previousState == LOCATIONS.MAINPROFILEIMAGE){
          $state.go(LOCATIONS.MAINPROFILECOMMENTS);
        }
      };

      /////////////////////////////// DELETE COMMENTS //////////////////////////////////////////////////////////////////
      // $watch function to wait for user to load and determine if they are the owner
      $scope.$watch('user', function() {
        if($scope.user){
          if($scope.userId == $scope.user.$id){
            return $scope.listCanSwipe = true;
          } else{
            return $scope.listCanSwipe = false;
          }
        }
      });

      /**
       * @ngdoc function
       * @function deleteItem
       * @description
       * Delete notification item
       *
       * @param  {Object}  item Delete notification object
       */
      $scope.deleteItem = function(item){
        CommentService.deleteComment($scope.post.$id, item.$id);
      };

      ///////////////////////////// ATTACH AVATAR PROFILES /////////////////////////////////////////////////////////////
      /**
       * @ngdoc service
       * @description
       * User cache service from ng-init function attaching user profiles to the post
       *
       */
      $scope.users = UserCache.getCachedUserProfiles();

      /////////////////////////////// GET USER ID //////////////////////////////////////////////////////////////////////
      // Check if there is a userId string within local storage
      $scope.userId = localStorageService.get('userId');
      // If no angular local storage sting is available call ProfileService to retrieve one and save in local storage
      if($scope.userId === null){
        $scope.userId = ProfileService.getProfileId();
        localStorageService.set('userId', $scope.userId);
      }


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
        // function will not run is userId matches the userId of post
        if($scope.userId != userId){
          NavigationServices.viewUserState(viewHistory, userId);
        }
      };

      /////////////////////////////// UP VOTE //////////////////////////////////////////////////////////////////////////
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

      /////////////////////////////// ADD TO WARDROBE //////////////////////////////////////////////////////////////////
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

      /////////////////////////////// SHARE POPOVER ////////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function imageOptions
       * @description
       * Open ionic popup directive
       *
       */
      $scope.imageOptions = function () {
        var myPopup = $ionicPopup.show({
          templateUrl: 'templates/views/popup/share-options.html',
          cssClass: 'share-options-popover',
          title: 'Lorem Ipsum dolor imit',
          subTitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, quos!',
          buttons: [{
            text: 'Close',
            type: 'button-primary-full',
            onTap: function () {

            }
          }]
        });
        myPopup.then(function () {
        });
      };

      ///////////////////////////////// REQUEST FRIEND /////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name addFriend
       * @description
       * Send user friend request
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
        if($scope.imageHasLoaded){
          var state = false;
          var checkMemberRef = new Firebase(FIREBASE_URL + '/userProfile/' + $scope.userId + '/friend');
          var checkMemberRequestRef = new Firebase(FIREBASE_URL + '/userProfile/' + $scope.userId + '/friendRequestSent');
          checkMemberRef.child(postUser.$id).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
              state = true;
            }
          });
          checkMemberRequestRef.child(postUser.$id).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
              state = true;
            }
          });
          return state;
        }
      };
    }])
     .directive('focusInput', function($timeout, $parse) {
        return {
          //scope: true,   // optionally create a child scope
          link: function(scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function(value) {
              if(value === true) {
                $timeout(function() {
                  element[0].focus();
                });
              }
            });
            // on blur event:
            element.bind('blur', function() {
              scope.$apply(model.assign(scope, false));
            });
          }
        };
      });
