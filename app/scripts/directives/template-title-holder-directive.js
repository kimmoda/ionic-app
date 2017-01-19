'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.directive:titleHolder
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc directive
 * @description Adds a dark background when users clicks on camera button
 *
 */

angular.module('Outfitpic.Directive.TitleHolderTemplate', [])

  .directive('titleHolder', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/views/directives/title-holder.html',
      bindToController: true
    };
});
