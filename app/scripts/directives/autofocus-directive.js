'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.directive:validateEmail
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc directive
 * @description Adds a dark background when users clicks on camera button
 *
 */

angular.module('Outfitpic.Directive.AutoFocus', [])

  .directive('focusMe', function ($timeout) {
    return {
      link: function (scope, element, attrs) {
        if (attrs.focusMeDisable === 'true') {
          return;
        }
        $timeout(function () {
          element[0].focus();
          if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.show(); //open keyboard manually
          }
        }, 350);
      }
    };
});
