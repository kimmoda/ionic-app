'use strict';
/* **********************************************************************
 * @copyright: pkistler
 * @date  : 18/11/15
 * @name Outfitpic.factory:ProfileService
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Service for a authenticated users profile
 *
 */

angular.module('Outfitpic.Service.ProfileService', [])
	.factory('ProfileService', ['$firebaseHelper', '$rootScope', 'User', 'FIREBASE_URL', '$timeout', '$q',
           'localStorageService',
		function ($firebaseHelper, $rootScope, User, FIREBASE_URL, $timeout, $q, localStorageService) {

			var profileRef = $firebaseHelper.ref('/userProfile/');

			return {
        /**
         * @ngdoc method
         * @method getProfileId
         * @description
         * Return user id
         *
         * @returns  {String}  user User ID of logged in user
         */
        getProfileId : function () {
          var user = localStorageService.get('userId');
          if (user === null){
            user = User.getLoggedInUser();
            localStorageService.set('userId',user.uid );
            return user.uid;
          }
          return user;
        },

        /**
         * @ngdoc method
         * @method getProfile
         * @description
         * Return user id
         *
         * @returns  {Object}  Firebase object of user
         */
        getProfile : function () {
					var user = User.getLoggedInUser();
					return $firebaseHelper.object(profileRef, user.uid);
				},

        /**
         * @ngdoc method
         * @method getProfileById
         * @description
         * Return user id
         *
         * @returns  {Object}  Firebase object of user selected
         */
				getProfileById : function (userId) {
					return $firebaseHelper.object(profileRef, userId);
				},

        /**
         * @ngdoc method
         * @method getAvatar
         * @description
         * Return avatar of user
         *
         * @returns  {String}  Return avatar string
         */
        getAvatar : function () {
					var user = User.getLoggedInUser();
					return $firebaseHelper.object(profileRef, user.uid + '/avatar/');
				},

        /**
         * @ngdoc method
         * @method getAvatarById
         * @description
         * Returns a firebase avatar object for the specified user by it's id
         *
         * @returns  {String}  Return avatar string
         */
				getAvatarById : function (userId) {
					return $firebaseHelper.object(profileRef, userId + '/avatar/');
				},

        /**
         * @ngdoc method
         * @method getWardrobeRef
         * @description
         * The reference to the logged in users wardrobe
         *
         * @returns  {Object}  Return wardrobe key ref of logged in user
         */
        getWardrobeRef : function () {
					var user = User.getLoggedInUser();
					var wardrobeKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + user.uid + '/wardrobe');
					return wardrobeKeyRef;
				},

        /**
         * @ngdoc method
         * @method getUsersWardrobeRef
         * @description
         * The reference to the logged in users wardrobe
         *
         * @returns  {Object} Return wardrobe key ref of selected user
         */
        getUsersWardrobeRef : function (selectedUserId) {
          var wardrobeKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + selectedUserId + '/wardrobe');
          return wardrobeKeyRef;
        },

        /**
         * @ngdoc method
         * @method getLikesRef
         * @description
         * The reference to the logged in users liked posts
         *
         * @returns  {Object} Return like key ref of logged in user
         */
        getLikesRef : function () {
					var user = User.getLoggedInUser();
					var likedPostKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + user.uid + '/likedPost');
					return likedPostKeyRef;
				},

        /**
         * @ngdoc method
         * @method getUserLikesRef
         * @description
         * The reference to the selected user liked posts
         *
         * @returns  {Object} Return like key ref of selected user
         */
        getUserLikesRef : function (selectedUserId) {
          var likedPostKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + selectedUserId + '/likedPost');
          return likedPostKeyRef;
        },

        /**
         * @ngdoc method
         * @method getOutfitsRef
         * @description
         * The reference to the logged in users outfit posts
         *
         * @returns  {Object} Return outfits key ref of logged user
         */
        getOutfitsRef : function () {
					var user = User.getLoggedInUser();
					var outfitsKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + user.uid + '/posts');
					return outfitsKeyRef;
				},

        /**
         * @ngdoc method
         * @method getUserOutfitsRef
         * @description
         * The reference to the selected in users outfit posts
         *
         * @returns  {Object} Return outfits key ref of selected user
         */
        getUserOutfitsRef : function (selectedUserId) {
          var outfitsKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + selectedUserId + '/posts');
          return outfitsKeyRef;
        },

        /**
         * @ngdoc method
         * @method calculateLikesLength
         * @description
         * Calculate likes length of users profile
         *
         * @param callbackFunction The callback function to set the amount
         */
        calculateLikesLength : function (callbackFunction) {
					var user = User.getLoggedInUser();
					var likedPostKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + user.uid + '/likedPost');
					likedPostKeyRef.on('value', function (snapshot) {
						callbackFunction(snapshot.numChildren());
					});
				},

        /**
         * @ngdoc method
         * @method calculateUserLikesLength
         * @description
         * Calculates the amount of liked entries in selected user profile
         *
         * @param callbackFunction The callback function to set the amount
         */
        calculateUserLikesLength : function (callbackFunction) {
          var selectedUserId = localStorageService.get('profileUserId');
          var likedPostKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + selectedUserId + '/likedPost');
          likedPostKeyRef.on('value', function (snapshot) {
            callbackFunction(snapshot.numChildren());
          });
        },

        /**
         * @ngdoc method
         * @method calculateWardrobeLength
         * @description
         * Calculates the amount of wardrobe entries
         *
         * @param callbackFunction The callback function to set the amount
         */
        calculateWardrobeLength : function (callbackFunction) {
					var user = User.getLoggedInUser();
					var wardrobeKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + user.uid + '/wardrobe');
					wardrobeKeyRef.on('value', function (snapshot) {
						callbackFunction(snapshot.numChildren());
					});
				},

        /**
         * @ngdoc method
         * @method calculateUserWardrobeLength
         * @description
         * Calculates the amount of wardrobe entries in selected user profile
         *
         * @param callbackFunction The callback function to set the amount
         */
        calculateUserWardrobeLength : function (callbackFunction) {
          var selectedUserId = localStorageService.get('profileUserId');
          var wardrobeKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + selectedUserId + '/wardrobe');
          wardrobeKeyRef.on('value', function (snapshot) {
            callbackFunction(snapshot.numChildren());
          });
        },

        /**
         * @ngdoc method
         * @method calculateOutfitsLength
         * @description
         * Returns the amount of posts
         *
         * @param callbackFunction The callback function to set the amount
         */
        calculateOutfitsLength : function (callbackFunction) {
					var user = User.getLoggedInUser();
					var outfitsKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + user.uid + '/posts');
					outfitsKeyRef.on('value', function (snapshot) {
						callbackFunction(snapshot.numChildren());
					});
				},

        /**
         * @ngdoc method
         * @method calculateUserOutfitsLength
         * @description
         * Calculates the amount of outfit entries in selected user profile
         *
         * @param callbackFunction The callback function to set the amount
         */
        calculateUserOutfitsLength : function (callbackFunction) {
          var selectedUserId = localStorageService.get('profileUserId');
          var outfitsKeyRef = new Firebase(FIREBASE_URL + '/userProfile/' + selectedUserId + '/posts');
          outfitsKeyRef.on('value', function (snapshot) {
            callbackFunction(snapshot.numChildren());
          });
        }

			};

		}]);
