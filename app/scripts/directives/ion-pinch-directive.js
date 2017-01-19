'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.directive:ionPinch
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc directive
 * @description Drag element for tagging
 *
 */

angular.module('Outfitpic.Directive.IonPinch', [])

  .directive('ionPinch', ['$timeout', '$rootScope', 'PositionService', '$ionicPosition',
    function ($timeout, $rootScope, PositionService, $ionicPosition) {
      return {
        restrict: 'A',
        scope: {model:'='},
        link: function (scope, $element ) {
          $timeout(function () {
            var x = 0, y = 0, parentHeight, parentWidth, posX = 0, posY = 0,
              lastPosX = PositionService.getPositionX(),
              lastPosY = PositionService.getPositionY(),
              elementW = PositionService.getElemWidth(),
              elementH = PositionService.getElemHeight(),
              elem,
              itemId;
            ionic.onGesture('hold drag dragend', function (e) {
              if (e.srcElement.className == 'square disable-user-behavior' || e.srcElement.children) {
                e.gesture.srcEvent.preventDefault();
                e.gesture.preventDefault();
                if (e.target.className == 'square disable-user-behavior'){
                  elem = angular.element(e.target);
                  itemId = e.target.id;
                  $rootScope.itemSelect = String(itemId).charAt(7);
                } else if(e.target.className == 'text ng-binding'){
                  elem = angular.element(e.target.parentElement);
                  itemId = e.target.offsetParent.id;
                  $rootScope.itemSelect = String(itemId).charAt(7);
                } else if (e.target.className == 'tag-pin-new'){
                  elem = angular.element(e.target.parentElement);
                  itemId = e.target.offsetParent.id;
                  $rootScope.itemSelect = String(itemId).charAt(7);
                }
                var checkPosition = function(lastPosX, lastPosY){
                  PositionService.setPosition(lastPosX, lastPosY);
                  if (lastPosX >= 0 && lastPosX >= (parentWidth - (elementW *2)) && lastPosY >= (elementH * 2)) {
                    console.log('farRight pinch');
                    angular.element($element[0]).addClass('farRight');
                    angular.element($element[0]).removeClass('farTopLeft');
                    angular.element($element[0]).removeClass('farTop');
                    angular.element($element[0]).removeClass('farLeft');
                    var fr = 'farRight';
                    PositionService.setClass(fr);
                  } else if (lastPosY >= 0 && lastPosY <= (elementH * 2) && lastPosX >= 0 && lastPosX >= elementW) {
                    console.log('farTop pinch');
                    angular.element($element[0]).addClass('farTop');
                    angular.element($element[0]).removeClass('farTopLeft');
                    angular.element($element[0]).removeClass('farRight');
                    angular.element($element[0]).removeClass('farLeft');
                    var ft = 'farTop';
                    PositionService.setClass(ft);
                  } else if (lastPosY >= 0 && lastPosY <= elementH && lastPosX >= 0 && lastPosX <= elementW) {
                    console.log('farTopLeft pinch');
                    angular.element($element[0]).addClass('farTopLeft');
                    angular.element($element[0]).removeClass('farTop');
                    angular.element($element[0]).removeClass('farRight');
                    angular.element($element[0]).removeClass('farLeft');
                    var ftl = 'farTopLeft';
                    PositionService.setClass(ftl);
                  } else if (lastPosX >= 0 && lastPosX <= (elementW * 2) && lastPosY >= elementH) {
                    console.log('farLeft pinch');
                    angular.element($element[0]).addClass('farLeft');
                    angular.element($element[0]).removeClass('farTop');
                    angular.element($element[0]).removeClass('farRight');
                    angular.element($element[0]).removeClass('farTopLeft');
                    var fl = 'farLeft';
                    PositionService.setClass(fl);
                  } else{
                    var normal = 'normal';
                    PositionService.setClass(normal);
                    angular.element($element[0]).removeClass('farTop');
                    angular.element($element[0]).removeClass('farRight');
                    angular.element($element[0]).removeClass('farLeft');
                    angular.element($element[0]).removeClass('farTopLeft');
                  }
                };
                switch (e.type) {
                  case 'hold':
                    angular.element($element[0].childNodes[1]).css('background', '#EC4A3F');
                  case 'drag':
                    angular.element($element[0].childNodes[1]).css('background', '#EC4A3F');
                    parentHeight = $element.parent().parent().prop('clientHeight');
                    parentWidth = $element.parent().parent().prop('clientWidth');
                    elementW = $element.prop('clientWidth');
                    elementH = $element.prop('clientHeight');
                    PositionService.setTagSize(elementW, elementH);
                    $element.css({left: '', top: ''});
                    x = e.gesture.deltaX + lastPosX;
                    y = e.gesture.deltaY + lastPosY;
                    if (x >= 0 && x <= (parentWidth - elementW)) {
                      posX = e.gesture.deltaX + lastPosX;
                    }
                    if (y >= 0 && y <= parentHeight - elementH) {
                      posY = e.gesture.deltaY + lastPosY;
                    }
                    break;
                  case 'dragend':
                    var tagPos = $ionicPosition.position(elem);
                    PositionService.setImagePosition(tagPos.left, tagPos.top);
                    angular.element($element[0].childNodes[1]).css('background', '');
                    lastPosX = posX;
                    lastPosY = posY;
                    checkPosition(lastPosX, lastPosY);
                    $rootScope.$broadcast('drag-end');
                    break;
                }
                var transform = 'translate3d(' + posX + 'px,' + posY + 'px, 0) ';
                if(e.target.className !== 'text ng-binding'){
                  e.target.style.transform = transform;
                  e.target.style.webkitTransform = transform;
                } else{
                  e.srcElement.parentElement.style.transform = transform;
                  e.srcElement.parentElement.style.webkitTransform = transform;
                }
              } else {
                console.log('wrong');
              }
            }, $element[0]);
          });
        }
      };
    }]);
