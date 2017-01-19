'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.directive:socialIconsHolder
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc directive
 * @description Adds a dark background when users clicks on camera button
 *
 */

angular.module('Outfitpic.Directive.SocialIconTemplate', [])

  .directive('socialIconsHolder', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/views/directives/social-icons-holder.html',
      bindToController: true
    };
});
