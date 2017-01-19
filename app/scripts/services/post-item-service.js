'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:Auth
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Share data service which allows to pass data to the
 *				controller
 *
 */

angular.module('Outfitpic.Service.PostItemData', [])
  .factory('PostItemService', [
    function () {
      var items = [];
      var count = 0;
      var elementCount = 0;
      var image = '';
      return {
        /**
         * @ngdoc function
         * @function addElementCount
         * @description
         * Add +1 to element count for tagging picture function
         *
         */
        addElementCount: function () {
          elementCount++;
        },

        /**
         * @ngdoc function
         * @function removeElementCount
         * @description
         * Remove -1 to element count for tagging picture function
         *
         */
        removeElementCount: function () {
          elementCount--;
        },

        /**
         * @ngdoc function
         * @function retrieveElementCount
         * @description
         * Retrive count for elements within tag
         *
         */
        retrieveElementCount: function () {
          return elementCount;
        },

        /**
         * @ngdoc function
         * @function saveImage
         * @description
         * Save image after taking picture / ulpload from album
         *
         * @param   {String}  imageData Base64 code string of image
         */
        saveImage: function (imageData) {
          image = imageData;
        },

        /**
         * @ngdoc function
         * @function addItem
         * @description
         * Add item within tag process
         *
         * @param   {Object}  item Tag element item
         */
        addItem: function (item) {
          items.push({
            tag: item
          });
          count++;
        },

        /**
         * @ngdoc function
         * @function removeItem
         * @description
         * Remove item from tag array
         *
         */
        removeItem: function () {
          count--;
        },

        /**
         * @ngdoc function
         * @function returnItem
         * @description
         * Return item array
         *
         */
        returnItem: function () {
          return items;
        },

        /**
         * @ngdoc function
         * @function returnCount
         * @description
         * Return count function
         *
         */
        returnCount: function () {
          return count;
        },

        /**
         * @ngdoc function
         * @function returnImage
         * @description
         * Return image to controller function
         *
         */
        returnImage: function () {
          return image;
        },

        /**
         * @ngdoc function
         * @function resetItems
         * @description
         * Reset items after image upload
         *
         */
        resetItems: function () {
          items = [];
          return items;
        },

        /**
         * @ngdoc function
         * @function resetCount
         * @description
         * Reset count after image upload
         *
         */
        resetCount: function () {
          count = 0;
          return count;
        }
      };
    }]);
