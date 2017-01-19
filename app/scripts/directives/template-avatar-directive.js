'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.directive:avatarHolder
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc directive
 * @description Adds a dark background when users clicks on camera button
 *
 */

angular.module('Outfitpic.Directive.AvatarTemplate', [])

  .directive('avatarHolder', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/views/directives/avatar-holder.html',
      bindToController: true
    };
});
