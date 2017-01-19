/* **********************************************************************
 * @copyright: pkistler
 * @date  : 27/11/15
 * @name  : MasterDataService
 * **********************************************************************
 *
 * @copyright (c) 2015 All rights reserved for Outfitpic LTD
 * **********************************************************************
 * @ngdoc
 *
 * @description
 *
 */
'use strict';

angular.module('Outfitpic.Service.MasterData', [])
	.factory('MasterDataService', ['$firebaseHelper', 'FIREBASE_URL', '$firebaseObject',
		function ($firebaseHelper, FIREBASE_URL, $firebaseObject) {
			var masterDataRef = $firebaseHelper.ref('/masterData');

			return {
				/**
				 * Get parameters for news feed configuration
				 * @returns {syncObject} The object refering to news feed config section
				 */
				getNewsFeedConfig: function () {
					return $firebaseHelper.object(masterDataRef, 'newsFeedConfig');
				},
				getNewsFeedRef: function () {
					return $firebaseHelper.ref(masterDataRef, '/newsFeedConfig/newsFeedContent');
				},
        getSelectedFeedRef: function () {
          return $firebaseHelper.ref(masterDataRef, '/newsFeedConfig/newsFeedContent');
        },
        getFeedObject: function(id) {
          var ref = new Firebase(FIREBASE_URL + '/masterData/newsFeedConfig/newsFeedContent/' + id);
          var feed = $firebaseObject(ref);
          return feed;
        },

				calculateNewsFeedLength: function (callbackFunction) {
					$firebaseHelper.load(masterDataRef, '/newsFeedConfig/newsFeedContent', true).then(function (array) {
						callbackFunction(array.length);
					});
				},

				/**
				 * Get parameters for general configuration
				 * @returns {syncObject} The object refering to general config section
				 */
				getGeneralConfig: function () {
					return $firebaseHelper.object(masterDataRef, '/generalConfig');
				},

				/**
				 * Returns a firebase array of brands
				 * @returns {syncObject} The object referring all brans
				 */
				getBrands: function () {
					return $firebaseHelper.object($firebaseHelper.object(masterDataRef, 'brand'), true);
				}


			};
		}]);
