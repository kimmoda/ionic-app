'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:User
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Main service for getting user object
 *
 */

angular.module('Outfitpic.Service.UserService', [])
	.service('User', ['$q', '$firebase', '$firebaseObject', 'FIREBASE_URL',

		function($q, $firebase, $firebaseObject, FIREBASE_URL) {

		var userProfileRef = new Firebase(FIREBASE_URL + '/userProfile/');

		return {
			newUserRef: function (user) {
				return $firebaseObject(userProfileRef.child(user.uid));
			},

			getUserData: function (userId) {
				return $firebaseObject(userProfileRef.child(userId));
			},

			getLoggedInUser: function () {
				return userProfileRef.getAuth();
			}
		};

	}]);
