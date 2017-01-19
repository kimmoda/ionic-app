'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:Authentication
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Authentication serivce which deals with registration, login and change of password
 *
 */

angular.module('Outfitpic.Service.NavigationService', [])
  .factory('NavigationServices', ['localStorageService', 'LOCATIONS', '$ionicHistory', '$state', 'ScrollToService',
           'PostService',
    function (localStorageService, LOCATIONS, $ionicHistory, $state, ScrollToService, PostService) {

      return {
        /**
         * @ngdoc function
         * @function viewImageState
         * @description
         * View image function
         *
         *  @param  {Object} ionicHistory Ionic view history object
         *  @param  {String} userId Id of user
         */
        viewUserState: function(ionicHistory, userId){
          if(
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERGRID ||
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERIMAGE ||
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERUSERPROFILELIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERUSERPROFILEWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERUSERPROFILEOUTFITS){
            $state.go(LOCATIONS.DISCOVERUSERPROFILEOUTFITS, {user_id: userId});
            localStorageService.set('profileUserId', userId);
          } else if(
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDGRID ||
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDIMAGE ||
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDUSERLIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDUSERWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDUSEROUTFITS){
            $state.go(LOCATIONS.MYFEEDUSEROUTFITS, {user_id: userId});
            localStorageService.set('profileUserId', userId);
          } else if(
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEUSER ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEIMAGE ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILELIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEOUTFITS ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEUSERLIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEUSERWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEUSEROUTFITS
          ){
            $state.go(LOCATIONS.MAINPROFILEUSEROUTFITS, {user_id: userId});
            localStorageService.set('profileUserId', userId);
          } else if(
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONUSER ||
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONIMAGE ||
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONLIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONOUTFITS){
            $state.go(LOCATIONS.NOTIFICATIONOUTFITS, {user_id: userId});
            localStorageService.set('profileUserId', userId);
          }
        },

        /**
         * @ngdoc function
         * @function viewImageState
         * @description
         * View image function
         *
         *  @param  {Object} ionicHistory Ionic view history object
         *  @param  {String} postObj Post object
         */
        viewImageState: function(ionicHistory, postObj){
          var setResources = function(postObj){
            PostService.viewImageCountFunction(postObj);
            localStorageService.set('imageId', postObj.$id);
            localStorageService.set('previousState', $state.current.name);
          };
          if(
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERGRID ||
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERIMAGE ||
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERUSERPROFILELIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERUSERPROFILEWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERUSERPROFILEOUTFITS){
            $state.go(LOCATIONS.DISCOVERIMAGE, {group_id: postObj.$id});
            setResources(postObj);
          } else if(
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDGRID ||
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDIMAGE ||
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDUSERLIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDUSERWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDUSEROUTFITS){
            $state.go(LOCATIONS.MYFEEDIMAGE, {group_id: postObj.$id});
            setResources(postObj);
          } else if(
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEUSER ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEIMAGE ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILELIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEOUTFITS ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEUSERLIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEUSERWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEUSEROUTFITS
          ){
            $state.go(LOCATIONS.MAINPROFILEIMAGE, {group_id: postObj.$id});
            setResources(postObj);
          } else if(
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONUSER ||
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONIMAGE ||
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONLIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONOUTFITS){
            $state.go(LOCATIONS.NOTIFICATIONIMAGE, {group_id: postObj.$id});
            setResources(postObj);
          }
        },

        /**
         * @ngdoc function
         * @function viewCommentsList
         * @description
         * View comments list function which auto scrolls to where comments are
         *
         *  @param  {Object} ionicHistory Ionic view history object
         *  @param  {String} itemKey Item key Id
         */
        viewCommentsList: function(ionicHistory, itemKey){
          var scrollFunction = function(){
            // Scroll to comments input field service
            ScrollToService.commentsScroll();
            localStorageService.set('imageId', itemKey);
            localStorageService.set('previousState', $state.current.name);
          };
          if(
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERGRID ||
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERIMAGE ||
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERUSERPROFILELIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERUSERPROFILEWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.DISCOVERUSERPROFILEOUTFITS){
            $state.go(LOCATIONS.DISCOVERIMAGE, {group_id: itemKey});
            scrollFunction();
          } else if(
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDGRID ||
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDIMAGE ||
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDUSERLIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDUSERWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.MYFEEDUSEROUTFITS){
            $state.go(LOCATIONS.MYFEEDIMAGE, {group_id: itemKey});
            scrollFunction();
          } else if(
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEUSER ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEIMAGE ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILELIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEOUTFITS ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEUSERIMAGE ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEUSERLIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEUSERWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.MAINPROFILEUSEROUTFITS){
            $state.go(LOCATIONS.MAINPROFILEIMAGE, {group_id: itemKey});
            scrollFunction();
          } else if(
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONUSER ||
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONIMAGE ||
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONLIKES ||
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONWARDROBE ||
            ionicHistory.currentView.stateName == LOCATIONS.NOTIFICATIONOUTFITS){
            $state.go(LOCATIONS.NOTIFICATIONIMAGE, {group_id: itemKey});
            scrollFunction();
          }
        },

        /**
         * @ngdoc function
         * @function goBackFunction
         * @description
         * Go back function for hard refresh states
         *
         *  @param  {Object} viewHistory Ionic view history object
         *  @param  {Object} currentState Object showing current state
         */
        goBackFunction: function(viewHistory, currentState){
          console.log('goBackFunction');
          if(viewHistory.backView){
            //console.log('has a history stack')
            //console.log('viewHistory.backView', viewHistory.backView)
            if(viewHistory.backView.stateName == LOCATIONS.DISCOVERIMAGECOMMENTS){
              //console.log('this is true')
              $state.go(LOCATIONS.DISCOVERGRID);
            } else if(viewHistory.backView.stateName == LOCATIONS.MYFEEDCOMMENTS){
              $state.go(LOCATIONS.MYFEEDGRID);
            } else if(viewHistory.backView.stateName == LOCATIONS.NOTIFICATIONCOMMENTS){
              $state.go(LOCATIONS.NOTIFICATIONS);
            } else{
              $ionicHistory.goBack();
            }
          } else {
            console.log('no history stack');
            if(
              currentState == LOCATIONS.DISCOVERUSERPROFILELIKES ||
              currentState == LOCATIONS.DISCOVERUSERPROFILEWARDROBE ||
              currentState == LOCATIONS.DISCOVERUSERPROFILEOUTFITS ||
              currentState == LOCATIONS.DISCOVERIMAGE){
              $state.go(LOCATIONS.DISCOVERGRID);
            } else if (currentState == LOCATIONS.MYFEEDUSERLIKES ||
              currentState == LOCATIONS.MYFEEDUSERWARDROBE ||
              currentState == LOCATIONS.MYFEEDUSEROUTFITS){
              $state.go(LOCATIONS.MYFEEDGRID);
            } else if (currentState == LOCATIONS.NOTIFICATIONLIKES ||
              currentState == LOCATIONS.NOTIFICATIONWARDROBE ||
              currentState == LOCATIONS.NOTIFICATIONOUTFITS){
              $state.go(LOCATIONS.NOTIFICATIONS);
            }
          }
        },

        /**
         * @ngdoc function
         * @function checkBackState
         * @description
         * Checks if hard refresh state just came from comments page and nav arrow will not go back to this page
         *
         *  @param  {Object} viewHistory Ionic view history object
         */
        checkBackState: function(viewHistory){
          if(
            viewHistory.backView.stateName == LOCATIONS.DISCOVERIMAGECOMMENTS ||
            viewHistory.backView.stateName == LOCATIONS.MYFEEDCOMMENTS ||
            viewHistory.backView.stateName == LOCATIONS.NOTIFICATIONCOMMENTS
          ){
            return true;
          }
        }
      };

    }]);
