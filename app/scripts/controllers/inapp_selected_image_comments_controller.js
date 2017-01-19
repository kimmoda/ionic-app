'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:SelectedImageCommentsController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Controller to show the extended comments on a different page
 *
 */

angular.module('Outfitpic.Controller.SelectedImageComments', [])
  .controller('SelectedImageCommentsController', ['$scope', '$ionicHistory', 'User', 'ProfileService',
              'UserCache', 'ShareData', 'PostService','FIREBASE_URL', 'CommentService', 'UserImages', '$firebaseArray',
              '$state', 'localStorageService', 'PopUpService', 'UserLevel', 'NavigationServices',
    function ($scope, $ionicHistory, User, ProfileService, UserCache, ShareData, PostService, FIREBASE_URL,
              CommentService, UserImages, $firebaseArray, $state, localStorageService, PopUpService, UserLevel,
              NavigationServices) {

      /////////////////////////////// GET HISTORY STACK ////////////////////////////////////////////////////////////////
      // Get ionic history stack
      var viewHistory = $ionicHistory.viewHistory();

      //////////////////////// USER LEVEL DETECTION ////////////////////////////////////////////////////////////////////
      // Checks the user level allowing to show tutorials on pages
      UserLevel.checkUserLevel();

      ///////////////////////////// VARIABLES //////////////////////////////////////////////////////////////////////////
      var ref = UserImages;
      $scope.navTitle = ShareData.retrieveImageData().imageTitle;
      $scope.imageId = ShareData.retrieveImageData().imageId;
      $scope.postUserObj = ShareData.retrieveImageData().imageUser;
      $scope.user = localStorageService.get('userId');

      ///////////////////////////// CHECK HARD REFRESH /////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function checkHistory
       * @description
       * This method checks if user object is available from hard refresh
       * and if page has been hard refreshed
       */
      var checkHardRefresh = function(){
        if(!$scope.user){
          $scope.user = ProfileService.getProfileId();
        }
      };
      checkHardRefresh();

      ///////////////////////////// BACK TO PREVIOUS ///////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name checkHistory
       * @description
       * This method checks if user has $ionicHistory stack
       * and if page has been hard refreshed
       */
      var checkHistory = function(){
        var v = $ionicHistory.viewHistory();
        if(!v.backView){
          $scope.showTempBackButton = true;
          $scope.myGoBack = function () {
            $state.go(localStorageService.get('previousState'));
          };
        }
      };
      checkHistory();

      ///////////////////////////// GET IMAGE DETAILS //////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @name loadCommentsData
       * @description Load comments data associated with imageObj
       */

      var loadCommentsData = function(){
        $scope.comments = ShareData.retrieveImageData().commentData;

        if(!$scope.comments){
          $scope.loadingComments = true;
          var picture = $firebaseArray(ref);
          picture.$loaded().then(function (picture) {
            var imageObj = picture.$getRecord(localStorageService.get('imageId'));
            $scope.navTitle = imageObj.itemTitle;
            $scope.comments = imageObj.comments;
            $scope.imageId = localStorageService.get('imageId');
            var itemsRef = PostService.getCommentsRef($scope.imageId);
            $scope.comments = $firebaseArray(itemsRef);
            $scope.loadingComments = false;
            $scope.postUserObj = User.getUserData(imageObj.user);
          }).catch(function (error) {
            console.log('Error:', error);
            PopUpService.errorPopup(error);
          });
        }
      };
      loadCommentsData();

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
        CommentService.postComments(comment, $scope.imageId, $scope.postUserObj);
        $scope.image.comments = '';
      };

      ///////////////////////////// ATTACH AVATAR PROFILES /////////////////////////////////////////////////////////////
      /**
       * @ngdoc service
       * @description
       * User cache service from ng-init function attaching user profiles to the post
       *
       */
      $scope.users = UserCache.getCachedUserProfiles();

      /////////////////////////////// DELETE COMMENT ///////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @description
       * $watch function to wait for user to load and determine if they are the owner
       * of the post allowing them to delete the message comment
       */
      $scope.$watch('postUserObj', function() {
        if($scope.postUserObj){
          if($scope.user == $scope.postUserObj.$id){
            return $scope.listCanSwipe = true;
          } else{
            return $scope.listCanSwipe = false;
          }
        }
      });

      /**
       * @ngdoc function
       * @param {Object=} item contains the post object
       * @description
       * Delete comment function
       */
      $scope.deleteItem = function(item){
        CommentService.deleteComment($scope.imageId, item.$id);
      };

      ///////////////////////////////// VIEW USER PROFILE OF COMMENT ///////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function viewUser
       * @description
       * Open state to view user profile of comment
       *
       * @param  {String}  userId User ID of the person selected
       */
      $scope.viewUser = function (userId) {
        // function will not run is userId matches the userId of post
        if($scope.userId != userId){
          NavigationServices.viewUserState(viewHistory, userId);
        }
      };

    }]);
