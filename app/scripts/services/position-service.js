'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:PositionService
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Share data service which allows to pass data to the
 *				controller
 *
 */
angular.module('Outfitpic.Service.PositionData', [])
	.service('PositionService', [
		function () {
			var posX = 0;
			var posY = 0;
      var imgPosX = 0;
      var imgPosY = 0;
      var elementWidth = 0;
      var elementHeight = 0;
      var deviceWidth;
      var deviceHeight;
      var cssClass = 'normal';
			return {
				setPosition: function (positionX, positionY) {
					posX = positionX;
					posY = positionY;
				},
        setImagePosition: function(posX, posY){
          imgPosX = posX;
          imgPosY = posY;
        },
        getImagePositionX: function(){
          return imgPosX;
        },
        getImagePositionY: function(){
          return imgPosY;
        },
				getPositionX: function () {
					return posX;
				},
				getPositionY: function () {
					return posY;
				},
        setTagSize: function(elemW, elemH){
          elementWidth = elemW;
          elementHeight = elemH;
        },
        getElemWidth: function(){
          return elementWidth;
        },
        getElemHeight: function(){
          return elementHeight;
        },
        saveDeviceDimensions: function(deviceW, deviceH){
          deviceWidth = deviceW;
          deviceHeight = deviceH;
        },
        returnDeviceWidth: function(){
          return deviceWidth;
        },
        returnDeviceHeight: function(){
          return deviceHeight;
        },
        setClass: function(style){
          cssClass = style;
        },
        getClass: function(){
          return cssClass;
        }

			};
		}])
;
