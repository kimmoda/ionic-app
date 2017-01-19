'use strict';
/* **********************************************************************
 * @copyright: nshan
 * @date  : 18/11/15
 * @name Outfitpic.factory:CheckUserService
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Service for a authenticated users profile
 *
 */

angular.module('Outfitpic.Service.CheckUserService', [])
	.factory('CheckUserService', ['FIREBASE_URL',
		function (FIREBASE_URL) {

			return {
        /**
         * @ngdoc method
         * @method checkIfUserHasLiked
         * @description
         * Check if the user has liked the item
         *
         * // TODO: find out what upVote is
         * @param   {Object}  upVote
         * @param   {String}  userId User id string
         * @param   {String}  postId Post id string
         */
        checkIfUserHasLiked: function(upVote, userId, postId){
          var state = false;
          if(upVote !== null){
            var upVoteRef = new Firebase(FIREBASE_URL + '/posts/' + postId + '/upVote');
            upVoteRef.child(userId).once('value', function(snapshot) {
              var exists = (snapshot.val() !== null);
              if (exists) {
                state = true;
              }
            });
          }
          return state;
        },

        /**
         * @ngdoc method
         * @method checkIfUserHasHung
         * @description
         * Check if the user has hung item in their wardrobe
         *
         * // TODO: find out what wardrobeItem is
         * @param   {Object}  wardrobeItem
         * @param   {String}  userId User id string
         * @param   {String}  postId Post id string
         */
        checkIfUserHasHung: function(wardrobeItem, userId, postId){
          var state = false;
          if(wardrobeItem !== null){
            var wardrobeRef = new Firebase(FIREBASE_URL + '/posts/' + postId + '/wardrobeRef');
            wardrobeRef.child(userId).once('value', function(snapshot) {
              var exists = (snapshot.val() !== null);
              if (exists) {
                state = true;
              }
            });
          }
          return state;
        },

        /**
         * @ngdoc method
         * @method checkIfUserHasBeenAdded
         * @description
         * Check if the user has been added to friends list
         *
         * @param   {String}  userId User id string
         * @param   {String}  postUserId Post user id string
         */
        checkIfUserHasBeenAdded: function(postUserId, userId){
          var state = false;
          var checkMemberRef = new Firebase(FIREBASE_URL + '/userProfile/' + userId + '/friend');
          var checkMemberRequestRef = new Firebase(FIREBASE_URL + '/userProfile/' + userId + '/friendRequestSent');
          checkMemberRef.child(postUserId).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
              state = true;
            }
          });
          checkMemberRequestRef.child(postUserId).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
              state = true;
            }
          });
          return state;
        },

        /**
         * @ngdoc method
         * @method checkIfUserIsFriend
         * @description
         * Check if the user is a friend
         *
         * @param   {String}  userId User id string
         * @param   {String}  postUserId Post user id string
         */
        checkIfUserIsFriend: function(postUserId, userId){
          var state = false;
          var checkMemberRef = new Firebase(FIREBASE_URL + '/userProfile/' + userId + '/friend');
          checkMemberRef.child(postUserId).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
              state = true;
            }
          });
          return state;
        }


			};

		}]);
