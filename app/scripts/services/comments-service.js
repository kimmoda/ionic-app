'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:CommentService
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Notification methods to return FIREBASE refs for
 *				      sending objects and delete methods
 *
 */

angular.module('Outfitpic.Service.CommentService', [])
  .factory('CommentService', ['FIREBASE_URL', '$firebaseHelper', 'PushService', 'ProfileService', 'PopUpService',
    function (FIREBASE_URL, $firebaseHelper, PushService, ProfileService, PopUpService) {

      var rootRef = $firebaseHelper.ref('/');

      return {
        /**
         * @ngdoc method
         * @method deleteComment
         * @description
         * Delete comment function. Only user of the post can delete comments
         *
         * @param   {String}  postId The id of the post
         * @param   {String}  commentId The id of the comment
         */
        deleteComment: function(postId, commentId){
          var commentDeleteRef = new Firebase(FIREBASE_URL + '/posts/' +  postId + '/comments/' + commentId);
          commentDeleteRef.remove();
        },

        /**
         * @ngdoc method
         * @method postComments
         * @description
         * Post a comment to a certain post
         *
         * @param   {String}  comment The comment to persist
         * @param   {Object}  postUsrObj Object of the user belong to post item
         * @param   {Object}  postId PostId of post
         */
        postComments: function (comment, postId, postUsrObj) {
          var userObj = ProfileService.getProfile();
          userObj.$loaded().then(function (result) {
            var user = result;
            var date = new Date();
            if (comment) {
              var newPostRef = rootRef.child('posts').push();
              var newPostKey = newPostRef.key();
              var commentObject = {};
              commentObject['posts/' + postId + '/comments/' + newPostKey] = {
                fbTimestamp: Firebase.ServerValue.TIMESTAMP,
                text: comment,
                userName: user.username,
                user: user.$id,
                timestamp: date,
                createdAt: 0 - Date.now()
              };
              if (user.$id !== postUsrObj.$id) {
                commentObject['userProfile/' + postUsrObj.$id + '/notifications/' + newPostKey] = {
                  fbTimestamp: Firebase.ServerValue.TIMESTAMP,
                  user: user.$id,
                  postId: postId,
                  timestamp: date,
                  createdAt: 0 - Date.now(),
                  notificationId: 3,
                  status: 'unread',
                  comment: comment
                };
                if(postUsrObj.deviceToken) {
                  var message = PushService.createMessage(3, user.username, postUsrObj.deviceToken);
                  PushService.sendMessage(message);
                }
                var notificationCountRef = new Firebase(FIREBASE_URL + '/userProfile/' +  postUsrObj.$id + '/notificationCount/');
                notificationCountRef.transaction(function (current_value) {
                  return (current_value || 0) + 1;
                });
              }
              rootRef.update(commentObject, function (error) {
                if (error) {
                  console.log('Error updating data:', error);
                  PopUpService.errorPopup(error);
                }
              });
            }
          }).catch(function (error) {
            console.log('Error:', error);
            PopUpService.errorPopup(error);
          });
        },

        /**
         * @ngdoc method
         * @method postComments
         * @description
         * Post a comment to a certain post
         *
         * @param   {String}  comment The comment to persist
         * @param   {Object}  postUsrObj Object of the user belong to post item
         * @param   {Object}  postId Post id
         * @param   {Object}  taggedUserObjId Tagged user object
         */
        postCommentsWithUser: function (comment, postId, postUsrObj, taggedUserObjId) {
          var userObj = ProfileService.getProfile();
          userObj.$loaded().then(function (result) {
            var user = result;
            var date = new Date();
            if (comment) {
              var newPostRef = rootRef.child('posts').push();
              var newPostKey = newPostRef.key();
              var commentObject = {};
              commentObject['posts/' + postId + '/comments/' + newPostKey] = {
                fbTimestamp: Firebase.ServerValue.TIMESTAMP,
                text: comment,
                userName: user.username,
                user: user.$id,
                timestamp: date,
                createdAt: 0 - Date.now()
              };
              if (user.$id !== postUsrObj.$id) {
                // notification id 3 to show what message within notifcations section
                commentObject['userProfile/' + postUsrObj.$id + '/notifications/' + newPostKey] = {
                  fbTimestamp: Firebase.ServerValue.TIMESTAMP,
                  user: user.$id,
                  postId: postId,
                  timestamp: date,
                  createdAt: 0 - Date.now(),
                  notificationId: 3,
                  status: 'unread',
                  comment: comment
                };
                // notification id 4 to show what message within notifcations section
                commentObject['userProfile/' + taggedUserObjId + '/notifications/' + newPostKey] = {
                  fbTimestamp: Firebase.ServerValue.TIMESTAMP,
                  user: user.$id,
                  postId: postId,
                  timestamp: date,
                  createdAt: 0 - Date.now(),
                  notificationId: 4,
                  status: 'unread',
                  comment: comment
                };

                if(postUsrObj.deviceToken) {
                  var message = PushService.createMessage(3, user.username, postUsrObj.deviceToken);
                  PushService.sendMessage(message);
                }
                var notificationCountRef = new Firebase(FIREBASE_URL + '/userProfile/' +  postUsrObj.$id + '/notificationCount/');
                notificationCountRef.transaction(function (current_value) {
                  return (current_value || 0) + 1;
                });
              }
              rootRef.update(commentObject, function (error) {
                if (error) {
                  console.log('Error updating data:', error);
                  PopUpService.errorPopup(error);
                }
              });
            }
          }).catch(function (error) {
            console.log('Error:', error);
            PopUpService.errorPopup(error);
          });
        }

      };
    }]);


