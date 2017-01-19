'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.config:HttpConfig
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Http config to allow API calls
 *
 */


angular.module('Outfitpic.Config.Http', [])

  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
  }]);

