'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:LoadingSpinner
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Adds a loading spinner while waiting for views/data to load
 *
 */

angular.module('Outfitpic.Service.LoadingSpinner', [])
  .factory('LoadingSpinner', ['$ionicLoading',
    function ($ionicLoading) {
      var busy = null;
      return {
        /**
         * @ngdoc method
         * @method show
         * @description
         * Show ionic loading spinner
         *
         */
        show: function () {
          busy = $ionicLoading.show({
            templateUrl: 'templates/views/loaders/main-loader.html',
            animation: 'fade-in',
            showBackdrop: true,
            showDelay: 10
          });
        },
        /**
         * @ngdoc method
         * @method hide
         * @description
         * Hide ionic loading spinner
         *
         */
        hide: function () {
          $ionicLoading.hide();
        }
      };
    }]);
