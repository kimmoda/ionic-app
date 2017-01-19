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

angular.module('Outfitpic.Directive.DeleteItemTemplate', [])

  .directive('deleteItemHolder', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/views/directives/delete-item-holder.html',
      bindToController: true
    };
});
