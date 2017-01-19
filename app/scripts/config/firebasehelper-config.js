'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.config:FireBaseHelpConfig
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Firebase helper code to reduce code bloating
 *
 */


angular.module('Outfitpic.Config.FirebaseHelper', [])
	.config(function ($firebaseHelperProvider) {
		$firebaseHelperProvider.namespace('outfitpictest');
	});
