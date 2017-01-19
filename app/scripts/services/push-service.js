/* **********************************************************************
 * @copyright: pkistler
 * @date  : 13/02/16
 * @name  : push-service.js
 * **********************************************************************
 *
 * @copyright (c) 2015 All rights reserved for Outfitpic LTD
 * **********************************************************************
 * @ngdoc
 *
 * @description Handles pushwoosh notifications
 *
 */
'use strict';
angular.module('Outfitpic.Service.PushService', [])
	// use factory for services
	.service('PushService', ['$http', 'PUSHWOOSH',
		function ($http, PUSHWOOSH) {

			var createUrl = 'https://cp.pushwoosh.com/json/1.3/createMessage';
      var messageContent;
      var pushMessage;
			return {

        /**
         * @ngdoc function
         * @function createMessage
         * @description
         * Creates a push message content as JSON
         *
         * @param  {Number} index Index for what notification to send
         * @param  {Object} user User object
         * @param  {String} deviceToken Device token to user who clicked notification
         */
				createMessage: function (index, user, deviceToken) {
          if(index == 1){
            messageContent = user + ' ' + 'likes your post';
            pushMessage = {
            	'request': {
            		'application': PUSHWOOSH.APPID,
            		'auth': PUSHWOOSH.APIKEY,
            		'notifications': [{
            			'send_date': 'now',
            			'ignore_user_timezone': true,
            			'content': messageContent,
            			'ios_badges': '+1',
                  'devices': deviceToken
            		}]
            	}
            };
            return JSON.stringify(pushMessage);

          } else if(index == 2){
            messageContent = user  + ' ' + 'added your post to their wardrobe';
            pushMessage = {
              'request': {
                'application': PUSHWOOSH.APPID,
                'auth': PUSHWOOSH.APIKEY,
                'notifications': [{
                  'send_date': 'now',
                  'ignore_user_timezone': true,
                  'content': messageContent,
                  'ios_badges': '+1',
                  'devices': deviceToken
                }]
              }
            };
            return JSON.stringify(pushMessage);
          } else if(index == 3){
            messageContent = user  + ' ' + 'commented on your post';
            pushMessage = {
              'request': {
                'application': PUSHWOOSH.APPID,
                'auth': PUSHWOOSH.APIKEY,
                'notifications': [{
                  'send_date': 'now',
                  'ignore_user_timezone': true,
                  'content': messageContent,
                  'ios_badges': '+1',
                  'devices': deviceToken
                }]
              }
            };
            return JSON.stringify(pushMessage);
          }

				},

        /**
         * @ngdoc function
         * @function createMessage
         * @description
         * Pushes notification finally online
         *
         * @param {Object} message Message object created with function createMessage()
         */
        sendMessage: function (message) {
					$http.post(createUrl, message).success(function () {
						console.log('Notification success');
					}).error(function () {
						console.log('Notification failure');
					});
				}
			};
		}]
);
