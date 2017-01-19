'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.config:LocalStorageConfig
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description Local storage config
 *
 */


angular.module('Outfitpic.Config.LocalStorage', [])

  .config(function (localStorageServiceProvider) {

    localStorageServiceProvider
      .setPrefix('outfitpic')
      .setNotify(true, true);
  });

