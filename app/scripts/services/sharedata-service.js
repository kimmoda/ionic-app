'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:ShareData
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Share data service which allows to pass data to the
 *				      controller
 *
 */

angular.module('Outfitpic.Service.ShareData', [])
    .factory('ShareData', [
      function () {
        var shareData = {};
        var imageData = {};
        var tabNumber = 1;
        return {
          /**
           * @ngdoc function
           * @function saveImageUser
           * @description
           * Share image between controllers
           *
           * @param {String} imageUser Save image uploaded by user
           */
          saveImageUser: function(imageUser){
            imageData.imageUser = imageUser;
          },

          /**
           * @ngdoc function
           * @function saveImageTitle
           * @description
           * Save image title
           *
           * @param {String} imageName image title
           */
          saveImageTitle: function(imageName){
            imageData.imageTitle = imageName;
          },

          /**
           * @ngdoc function
           * @function saveImageId
           * @description
           * Share image variable
           *
           * @param {String} imageVar image variable
           */
          saveImageId: function(imageVar){
            imageData.imageId = imageVar;
          },

          /**
           * @ngdoc function
           * @function saveComments
           * @description
           * Share image comments
           *
           * @param {String} comments comments variable
           */
          saveComments: function (comments) {
            imageData.commentData = comments;
          },

          /**
           * @ngdoc function
           * @function retrieveImageData
           * @description
           * Return image object
           *
           * @return {Object} image object
           */
          retrieveImageData: function(){
            return imageData;
          },

          /**
           * @ngdoc function
           * @function saveEmail
           * @description
           * Share data function
           *
           * @return {Object} user user object
           */
          saveEmail: function (user) {
            shareData.email = user.email;
          },

          /**
           * @ngdoc function
           * @function returnItem
           * @description
           * Share data function
           *
           * @return {Object} return shareData object
           */
          returnItem: function () {
            return shareData;
          },

          /**
           * @ngdoc function
           * @function saveTabNumber
           * @description
           * Share data function
           *
           * @param {String} newNumber number of tab selected
           */
          saveTabNumber: function(newNumber){
            tabNumber = newNumber;
          },

          /**
           * @ngdoc function
           * @function returnTabNumber
           * @description
           * Share data function
           *
           * @return {Object} return tabNumber object
           */
          returnTabNumber: function () {
            return tabNumber;
          }
        };
      }]);
