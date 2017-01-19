/* **********************************************************************
 * @copyright: pkistler
 * @date  : 04/02/16
 * @name  : scroll-to-service.js
 * **********************************************************************
 *
 * @copyright (c) 2015 All rights reserved for Outfitpic LTD
 * **********************************************************************
 * @ngdoc service
 * @description
 *
 */
'use strict';
angular.module('Outfitpic.Service.ScrollToService', [])
  // use factory for services
  .service('ScrollToService', ['$timeout', '$location', '$ionicScrollDelegate',
    function ($timeout, $location, $ionicScrollDelegate) {
      return {
        /**
         * @ngdoc function
         * @function commentsScroll
         * @description
         * Scroll to comments section after image is expanded function
         *
         */
        commentsScroll: function(){
          $timeout(function() {
            $location.hash('scroll-to-section');
            var handle = $ionicScrollDelegate.$getByHandle('image-selected');
            handle.anchorScroll(true);
          }, 400);
        }
      };


    }])
;
