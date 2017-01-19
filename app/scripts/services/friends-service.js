/* **********************************************************************
 * @copyright: pkistler
 * @date  : 04/02/16
 * @name  : friends-service.js
 * **********************************************************************
 *
 * @copyright (c) 2015 All rights reserved for Outfitpic LTD
 * **********************************************************************
 * @ngdoc service
 * @description
 *
 */
'use strict';
angular.module('Outfitpic.Service.FriendsService', [])
  // use factory for services
  .service('FriendsService', ['$firebaseHelper', '$firebaseObject', '$firebaseArray', 'FIREBASE_URL', 'ProfileService',
           'User', 'PushService', 'ToastService',
    function ($firebaseHelper, $firebaseObject, $firebaseArray, FIREBASE_URL, ProfileService, User, PushService,
             ToastService) {

      var profileRef = $firebaseHelper.ref('/userProfile/');
      var rootRef = $firebaseHelper.ref('/');

      return {
        /**
         * @ngdoc function
         * @function getFriendRequests
         * @description
         * Gets friend requests array
         *
         * @param  {method}  callback call back function
         */
        getFriendRequests: function (callback) {
          var friendRequestRef = this.getFriendsRequestRef();
          $firebaseHelper.load(friendRequestRef, true).then(function (requests) {
            callback(requests);
          });
        },
        /**
         * @ngdoc function
         * @function getMyFriendsRef
         * @description
         * Helper function to get friends ref...
         *
         * @returns {*} ref to users friends
         */
        getMyFriendsRef: function () {
          var usrObjId = ProfileService.getProfileId();
          return $firebaseHelper.ref('/userProfile/' + usrObjId + '/friend');
        },
        /**
         * Quick version of getting the amount of friends
         * @param callback The function to set the amount value
         */
        countFriends: function (callback) {
          var userMyself = ProfileService.getProfile();
          $firebaseHelper.ref(profileRef, '/'+ userMyself.$id + '/friend/').on('value', function (snapshot) {
            callback(snapshot.numChildren());
          });
        },

        /**
         *
         * return friend ref from user profile to use within connections controller and create ng-repeat
         */
        getFriendsRequestRef: function () {
          var usrObjId = ProfileService.getProfileId();
          return  $firebaseHelper.ref(profileRef, usrObjId + '/friendRequest/');
        },
        /**
         * Add the given friend user id to your friends and remove the references from
         * the friend requests on both sides...
         *
         * @param friendUserId The user id of the person to add to the friends list
         */
        addFriend: function (friendUserId) {
          var myFriendRequests = this.getFriendsRequestRef();
          var myProfile = ProfileService.getProfile();
          var newFriendRef = $firebaseHelper.ref(profileRef, friendUserId);
          var date = new Date();
          var updateObject = {};
          var myId = myProfile.$id;
          //add my id to my new friends profile
          updateObject['userProfile/' + friendUserId + '/friend/' + myId] = {
            fbTimestamp: Firebase.ServerValue.TIMESTAMP,
            timestamp: date,
            createdAt: 0 - Date.now(),
            user: myProfile.$id
          };
          //add my friend to my list
          updateObject['userProfile/' + myId + '/friend/' + friendUserId] = {
            fbTimestamp: Firebase.ServerValue.TIMESTAMP,
            timestamp: date,
            createdAt: 0 - Date.now(),
            user: friendUserId

          };
          rootRef.update(updateObject, function (error) {
            if (error) {
              console.log('error, could not add friend: ', error);
            } else {
              //and now remove friend request
              var actualRequest = $firebaseHelper.ref(myFriendRequests, friendUserId);
              actualRequest.transaction(function (myFriendRequest) {
                if (myFriendRequest === null) {
                  console.log('requested delete ref does not exist!');
                } else {
                  actualRequest.remove();
                  $firebaseHelper.ref(newFriendRef, '/friendRequestSent/' + myProfile.$uid).remove();
                }
              });
              //needs to be sent to the user we ask for friendship
              var message = PushService.createMessage('User ' + myProfile.username + ' requests friendship...');
              PushService.sendMessage(message);
            }
          });
        },

        /**
         * @ngdoc function
         * @function deleteFriend
         * @description
         * Remove friend from list
         *
         * @param {String} friendUserId UserId of user to be deleted
         */
        deleteFriend: function(friendUserId){
          var deleteObject = {};
          var userId = ProfileService.getProfileId();
          deleteObject['/userProfile/' + userId + '/friend/' + friendUserId] = null;
          rootRef.update(deleteObject, function (error) {
            if (error) {
              //PopUpService.errorPopup(error);
            }
          });
        },
        /**
         * User request friendship with other user
         *
         * structure:
         * requester: /userProfile/friendRequestPending/<profile_id_receiver>
         * receicer: /userProfile/friendRequest/<profile_id-requester>
         *           /userProfile/notification/
         *
         *
         * @param requestFriendUserId
         */
        requestFriendship: function (requestFriendUserId) {
          var userMyself = ProfileService.getProfile();
          var userProfileRef = $firebaseHelper.ref('/userProfile/' + userMyself.$id);
          var date = new Date();
          var requestObjects = {};
          ToastService.greenToast(2);
          requestObjects['userProfile/' + userMyself.$id + '/friendRequestSent/' + requestFriendUserId] = {
            fbTimestamp: Firebase.ServerValue.TIMESTAMP,
            status: 'unseen',
            user: requestFriendUserId
          };
          requestObjects['userProfile/' + requestFriendUserId + '/friendRequest/' + userMyself.$id] = {
            fbTimestamp: Firebase.ServerValue.TIMESTAMP,
            timestamp: date,
            createdAt: 0 - Date.now(),
            user: userMyself.$id
          };
          var newNotificationRef = userProfileRef.child('notifications').push();
          var newNotificationKey = newNotificationRef.key();

          //TODO: need to review if actually needed to add to notifications group as connections is on the same page
          //	requestObjects['userProfile/' + requestFriendUserId + '/notifications/' + newNotificationKey] = {
          //fbTimestamp : Firebase.ServerValue.TIMESTAMP,
          //		user : requestFriendUserId,
          //		timestamp : date,
          //		createdAt : 0 - Date.now(),
          //		notificationId : 4,
          //		status : 'unread'
          //	};
          rootRef.update(requestObjects, function (error) {
            if (error) {
              console.log('no request could be send because: ', error);
            } else {
              //needs to be sent to the user we ask for friendship
              var message = PushService.createMessage('User ' + userMyself.username + ' requests friendship...');
              PushService.sendMessage(message);
            }
          })
        },

        // TODO: User might want to delete the request but not decline it
        deleteFriendRequest: function (requesterUserId) {
          var userId = ProfileService.getProfileId();
          var friendRequestDeleteRef =  $firebaseHelper.ref('/userProfile/' + userId + '/friendRequest/' + requesterUserId);
          friendRequestDeleteRef.remove();
        },


        /**
         * Not gonna accept friend request... remove it persistent
         * @param requesterUserId
         */
        declineFriendship: function (requesterUserId) {
          var userMyself = ProfileService.getProfile();
          var userProfileRef = $firebaseHelper.ref('/userProfile/' + userMyself.$id);

          var myListEntry = $firebaseHelper.ref('userProfile/' + userMyself.$id + '/friendRequest/' + requesterUserId);
          var requesterEntry = $firebaseHelper.ref('userProfile/' + requesterUserId + '/friendRequestSent/' + userMyself.$id);

          myListEntry.transaction(function () {
            myListEntry.remove(function () {
              //TODO pk: should we remove the requester entry????
              //requesterEntry.remove();
            });

          });
        },

        /**
         * Get a valid firebase array and put it into the callback method as param
         * @param callback The callback function to set the array into
         */
        getMyFriends: function (callback) {
          var userObj = ProfileService.getProfile();
          var friendRef = getMyFriendsRef();
          $firebaseHelper.load(friendRef, true).then(function (firebaseFriendArray) {
            callback(firebaseFriendArray)
          });

        },


        /**
         *
         * @param friendUserId The user id of the friend to remove from own friendlist
         */
        removeFriend: function (friendUserId) {
          var myself = ProfileService.getProfile();


        },


        suggestFriendsByLikes: function () {

        }
        ,

        suggestFriendsByCommonFriends: function () {

        }
        ,

        suggestFriendsByLocation: function () {

        }


      };


    }])
;
