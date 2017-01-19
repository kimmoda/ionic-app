'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.directive:toggleClass
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc directive
 * @description Allows to toggle between classes without addition CSS scripts
 *
 */
 
angular.module('Outfitpic.Directive.ToggleClass', [])
    .directive('toggleClass', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    element.toggleClass(attrs.toggleClass);
                });
            }
        };
    });
