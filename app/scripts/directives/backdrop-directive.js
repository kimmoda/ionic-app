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

angular.module('Outfitpic.Directive.CustomBackdrop', [])

.directive('customBackdrop', function() {
    return {
     restrict: 'E',
     template: '<div class=\'backdrop-test\' ng-if=\'isCameraBtnActive\'></div>'
    };
});
