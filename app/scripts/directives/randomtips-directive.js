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
 * @description Generate random text on loading screen and gives tips to users
 *
 */

angular.module('Outfitpic.Directive.Randomtips', [])

  .directive('randomTips', function () {

    var controller = ['$scope', '$rootScope', '$interval',
        function ($scope, $rootScope, $interval) {

          function callAtInterval() {
            $scope.randomQuote = $scope.quotes[Math.floor(Math.random() * $scope.quotes.length)];
          }

          var interval = $interval(callAtInterval, 8000);

          $rootScope.$on('$locationChangeStart', function () {
            $interval.cancel(interval);
          });

          $scope.quotes = [{
            value: 'Share ideas & tips with outfits you post up'
          }, {
            value: 'Tag outfits and let outfitpic find the nearest match to the item'
          }, {
            value: 'This is the app to show off your style and whats in fashion'
          }, {
            value: 'Become a leader or fashion icon with outfits people want'
          }, {
            value: 'View peoples outfits and try and purchase what the posted'
          }, {
            value: 'Build up a collection of outfits by adding them to your wardrobe'
          }];


        }
      ],

      template = '<div class="tips" ng-show="randomQuote"><i class="icon ion-information-circled" ng-show="randomQuote"></i>{{randomQuote.value}}</div>';


    return {
      restrict: 'E',
      controller: controller,
      template: template
    };
  });
