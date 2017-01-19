'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:UserImages
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Service to retrieve user images from firebase
 *
 */

angular.module('Outfitpic.Service.UserImageService', [])
// use factory for services
	.service('UserImages', ['$firebaseArray', 'FIREBASE_URL',
		function($firebaseArray, FIREBASE_URL) {
	    var itemsRef = new Firebase(FIREBASE_URL + '/posts/');
	    return itemsRef;
	}]);
