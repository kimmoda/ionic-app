'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:Newsfeed
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Service to return array of news feed post
 *
 */

angular.module('Outfitpic.Service.Newsfeed', [])
    .service('NewsFeed', ['$firebaseArray', 'FIREBASE_URL',
    	function($firebaseArray, FIREBASE_URL) {
        var ref = new Firebase(FIREBASE_URL + '/posts/');
        return $firebaseArray(ref);
    }]);