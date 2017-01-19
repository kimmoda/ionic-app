'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:Camera
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Cordova camera service sharing across many controllers
 *
 */

angular.module('Outfitpic.Service.Camera', [])
    .factory('Camera', ['$q',
        function($q) {
        return {
          /**
           * @ngdoc method
           * @method getPicture
           * @description
           * Cordova camera function opening native device camera application
           *
           * @param   {Object}  options Camera options
           */
            getPicture: function(options) {
                var q = $q.defer();
                navigator.camera.getPicture(function(result) {
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, options);
                return q.promise;
            }
        };
    }]);
