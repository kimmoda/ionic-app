/* **********************************************************************
 * @copyright: pkistler
 * @date  : 18/11/15
 * @name  : post-service.js
 * **********************************************************************
 *
 * @copyright (c) 2015 All rights reserved for Outfitpic LTD
 * **********************************************************************
 * @ngdoc service
 * @description
 *
 */
'use strict';
angular.module('Outfitpic.Service.PostService', [])
  .service('PostService', ['$firebaseObject', '$firebaseArray', 'FIREBASE_URL', '$firebaseHelper', 'ProfileService',
           'User', 'PUSHWOOSH', '$http', 'ToastService', 'PushService', 'PostItemService', 'PositionService',
            'PopUpService', '$ionicPopup', '$rootScope',
    function ($firebaseObject, $firebaseArray, FIREBASE_URL, $firebaseHelper, ProfileService, User, PUSHWOOSH,
              $http, ToastService, PushService, PostItemService, PositionService, PopUpService, $ionicPopup, $rootScope) {

      var postRef = $firebaseHelper.ref('/posts/');
      var tasks = $firebaseArray(postRef);
      var rootRef = $firebaseHelper.ref('/');
      var ref = new Firebase(FIREBASE_URL);

      return {
        /**
         * @ngdoc function
         * @method getFeed
         * @description
         * Returns Firebase array of posts
         *
         * @returns  {Firebase}  Firebase ref arrays
         */
        getFeed: function () {
          return tasks
        },

        /**
         * @ngdoc method
         * @method getPosts
         * @description
         * Returns firebase ref
         *
         * @returns  {Firebase}  Firebase ref
         */
        getPosts: function () {
          return postRef;
        },

        /**
         * @ngdoc method
         * @method getMyTimeline
         * @description
         * Return timeline of user
         *
         * @returns  {Firebase}  Firebase objects
         */
        getMyTimeline: function () {
          var userId = ProfileService.getProfileId();
          return $firebaseHelper.ref('/timelines/' + userId);;
        },

        /**
         * @ngdoc method
         * @method calculateTimelineLength
         * @description
         * Calculate users timeline length
         *
         * @returns  {Object}
         */
        calculateTimelineLength: function (callbackFunction) {
          var userId = ProfileService.getProfileId();
          var myTimelineRef = $firebaseHelper.ref('/timelines/' + userId);
          myTimelineRef.on('value', function (snapshot) {
            callbackFunction(snapshot.numChildren());
          });
        },

        /**
         * @ngdoc method
         * @method viewImageCount
         * @description
         * Return view image counter for sorting data in catergory in news feed #100
         *
         * @returns  {Firebase}  Firebase objects
         */
        viewImageCountFunction: function(postObj){
          var viewImageCountObject = {};
          viewImageCountObject['posts/' + postObj.$id + '/viewImageCount/'] = (postObj.viewImageCount - 1);
          rootRef.update(viewImageCountObject, function (error) {
            if (error) {
              console.log('Error updating data:', error);
              PopUpService.errorPopup(error);
            }
          });
        },

        /**
         * @ngdoc method
         * @method likeToggle
         * @description
         * Toggle like counter within item
         *
         * @param  {Object}  post Post object
         * @param  {Object}  postUsrObj Post user object
         */
        likeToggle: function (post, postUsrObj) {
          var user = ProfileService.getProfile();
          var date = new Date();
          var newPostRef = rootRef.child('posts').push();
          var newPostKey = newPostRef.key();
          var likesObject = {};
          var likesRef = $firebaseHelper.ref('/posts/' + post.$id + '/upVote');
          likesRef.child(user.$id).once('value', function (snapshot) {
            if (snapshot.val() === null) {
              likesObject['posts/' + post.$id + '/upVote/' + user.$id] = true;
              likesObject['posts/' + post.$id + '/likeCount/'] = (post.likeCount + 1);
              if (user.$id !== post.user) {
                likesObject['userProfile/' + user.$id + '/likedPost/' + post.$id] = {
                  userId: post.user,
                  date: 0 - Date.now()
                };
                likesObject['userProfile/' + post.user + '/notifications/' + newPostKey] = {
                  fbTimestamp: Firebase.ServerValue.TIMESTAMP,
                  user: user.$id,
                  postId: post.$id,
                  timestamp: date,
                  createdAt: 0 - Date.now(),
                  notificationId: 1,
                  status: 'unread'
                };
                if (postUsrObj.deviceToken) {
                  var message = PushService.createMessage(1, user.username, postUsrObj.deviceToken);
                  PushService.sendMessage(message);
                }
                var notiCountRef = new Firebase(FIREBASE_URL + '/userProfile/' + post.user + '/notificationCount/');
                notiCountRef.transaction(function (current_value) {
                  return (current_value || 0) + 1;
                });
              }
              rootRef.update(likesObject, function (error) {
                if (error) {
                  console.log('Error updating data:', error);
                }
              });
            } else {
              likesObject['posts/' + post.$id + '/upVote/' + user.$id] = null;
              likesObject['posts/' + post.$id + '/likeCount/'] = (post.likeCount - 1);
              likesObject['userProfile/' + user.$id + '/likedPost/' + post.$id] = null;
              rootRef.update(likesObject, function (error) {
                if (error) {
                  console.log('Error updating data:', error);
                  PopUpService.errorPopup(error);
                }
              });
            }
          });
        },

        /**
         * @ngdoc method
         * @method getOwnLikes
         * @description
         * Collect all profiles liked by authenticated user
         *
         * @returns {firebaseArray} An array of posts
         */
        getOwnLikes: function () {
          var userId = ProfileService.getProfileId();
          this.getLikesByUser(userId, callback);
        },

        /**
         * @ngdoc method
         * @method getLikesByUser
         * @description
         * Retrieve all post that like a defined post
         *
         * @param   {Object}        userId Post user object
         * @returns {firebaseArray} An array of posts
         */
        getLikesByUser: function (userId) {
          var postArray = [];
          $firebaseHelper.load('userProfile/' + userId + 'likedPost/', true).then(function (list) {
            angular.forEach(list, function (value, key) {
              postArray.push($firebaseHelper.object('posts/' + key));
            });
            return postArray;
          });
        },

        /**
         * @ngdoc method
         * @method getPostLikes
         * @description
         * Retrieve all post that like a defined post
         *
         * @param   {Object}    postId Post user object
         * @param   {Function}  callback Post user object
         */
        getPostLikes: function (postId, callback) {
          $firebaseHelper.load(postRef, '/' + postId + '/upVote', true).then(
            function (postLikes) {
              callback(postLikes);
            }
          );
        },

        /**
         * @ngdoc method
         * @method dislikeToggle
         * @description
         * Toggles the dislike and updates all relevant db-references
         *
         * @param   {Object}    post Post user object
         */
        dislikeToggle: function (post) {
          var user = ProfileService.getProfile();
          var dislikesObject = {};
          var dislikesRef = $firebaseHelper.ref('/posts/' + post.$id + '/downVote');
          dislikesRef.child(user.$id).once('value', function (snapshot) {
            if (snapshot.val() === null) {
              dislikesObject['posts/' + post.$id + '/downVote/' + user.$id] = true;
              if (user.$id !== post.user) {
                dislikesObject['userProfile/' + user.$id + '/dislikedPost/' + post.$id] = {
                  userId: post.user,
                  date: 0 - Date.now()
                };
                var message = PushService.createMessage(' ' + user.username + ' ' + 'dislikes your post');
                PushService.sendMessage(message);
              }
              rootRef.update(dislikesObject, function (error) {
                if (error) {
                  console.log('Error updating data:', error);
                  PopUpService.errorPopup(error);
                }
              });
            } else {
              dislikesObject['posts/' + post.$id + '/downVote/' + user.$id] = null;
              dislikesObject['userProfile/' + user.$id + '/dislikedPost/' + post.$id] = null;
              rootRef.update(dislikesObject, function (error) {
                if (error) {
                  console.log('Error updating data:', error);
                  PopUpService.errorPopup(error);
                }
              });
            }
          });
        },

        /**
         * @ngdoc method
         * @method getPostDislikes
         * @description
         * Toggles the dislike and updates all relevant db-references
         *
         * @param   {Object}    postId Post user object
         * @param   {Function}  callback Post user object
         */
        getPostDislikes: function (postId, callback) {
          $firebaseHelper.load(postRef, '/' + postId + '/downVote', true).then(
            function (postDislikes) {
              callback(postDislikes);
            }
          );
        },

        /**
         * @ngdoc method
         * @method calculatePostLength
         * @description
         * Calculate post length
         *
         * @param   {Function}  callbackFunction Post user object
         */
        calculatePostLength: function (callbackFunction) {
          postRef.on('value', function (snapshot) {
            callbackFunction(snapshot.numChildren());
          });
        },

        /**
         * @ngdoc method
         * @method toggleWardrobe
         * @description
         * Toggle wardrobe function count
         *
         * @param   {Object}  post Post object
         * @param   {Object}  postUsrObj Post user object
         */
        toggleWardrobe: function (post, postUsrObj) {
          var user = ProfileService.getProfile();
          var date = new Date();
          var wardrobeObject = {};
          var wardrobeRef = $firebaseHelper.ref('/posts/' + post.$id + '/wardrobeRef');
          wardrobeRef.child(user.$id).once('value', function (snapshot) {
            if (snapshot.val() === null) {
              var newPostRef = $firebaseHelper.ref('/posts').push();
              var newPostKey = newPostRef.key();
              wardrobeObject['posts/' + post.$id + '/wardrobeRef/' + user.$id] = true;
              wardrobeObject['posts/' + post.$id + '/wardrobeCount/'] = (post.wardrobeCount + 1);
              ToastService.greenToast(1);
              if (user.$id !== post.user) {
                wardrobeObject['userProfile/' + user.$id + '/wardrobe/' + post.$id] = {
                  userId: post.user,
                  date: 0 - Date.now()
                };
                wardrobeObject['userProfile/' + post.user + '/notifications/' + newPostKey] = {
                  fbTimestamp: Firebase.ServerValue.TIMESTAMP,
                  user: user.$id,
                  postId: post.$id,
                  timestamp: date,
                  createdAt: 0 - Date.now(),
                  notificationId: 2,
                  status: 'unread'
                };
                // Notification function
                if (postUsrObj.deviceToken) {
                  var message = PushService.createMessage(2, user.username, postUsrObj.deviceToken);
                  PushService.sendMessage(message);
                }
                var notiCountRef = new Firebase(FIREBASE_URL + '/userProfile/' + post.user + '/notificationCount/');
                notiCountRef.transaction(function (current_value) {
                  return (current_value || 0) + 1;
                });
              }
              ref.update(wardrobeObject, function (error) {
                if (error) {
                  console.log('Error updating data:', error);
                  PopUpService.errorPopup(error);
                }
              });
            } else {
              ToastService.blackToast(1);
              wardrobeObject['posts/' + post.$id + '/wardrobeRef/' + user.$id] = null;
              wardrobeObject['posts/' + post.$id + '/wardrobeCount/'] = (post.wardrobeCount - 1);
              wardrobeObject['userProfile/' + user.$id + '/wardrobe/' + post.$id] = null;
              ref.update(wardrobeObject, function (error) {
                if (error) {
                  console.log('Error updating data:', error);
                  PopUpService.errorPopup(error);
                }
              });
            }
          });
        },

        /**
         * @ngdoc method
         * @method getOwnWardrobe
         * @description
         * Get own wardrobe objects
         *
         * @param   {Function}  callback Post object
         */
        getOwnWardrobe: function (callback) {
          var userId = ProfileService.getProfileId();
          this.getWardrobeById(userId, callback);
        },

        /**
         * @ngdoc method
         * @method getWardrobeById
         * @description
         * Get wardrobe id's
         *
         * @param   {Object}  userId Post object
         * @param   {Function}  callback Post object
         */
        getWardrobeById: function (userId, callback) {
          var postArray = [];
          $firebaseHelper.load('userProfile/' + userId + '/wardrobe/', true).then(function (list) {
            angular.forEach(list, function (value) {
              var obj = $firebaseHelper.object('/posts/' + value.$id);
              postArray.push(obj);
            });
            callback(postArray);
          });
        },

        /**
         * @ngdoc method
         * @method getCommentsRef
         * @description
         * Get comments array
         *
         * @param   {String}  id Post object
         */
        getCommentsRef: function (id) {
          return $firebaseHelper.ref('/posts/' + id + '/comments/');
        },

        /**
         * @ngdoc method
         * @method postTopic
         * @description
         * Post topic function
         *
         * @param   {Object}  imgData Image object
         * @param   {String}  comment String comment
         */
        postTopic: function (imgData, comment) {
          this.fanPost();
          var user = ProfileService.getProfile();
          var date = new Date();
          var newPostRef = rootRef.child('posts').push();
          var newPostKey = newPostRef.key();
          var topicObject = {};
          topicObject['posts/' + newPostKey] = {
            image: imgData,
            fbTimestamp: Firebase.ServerValue.TIMESTAMP,
            timestamp: date,
            createdAt: 0 - Date.now(),
            user: user.$id,
            topicPost: comment,
            gridId: 2
          };
          // Do a deep-path update
          rootRef.update(topicObject, function (error) {
            if (error) {
              console.log('Error updating data:', error);
              PopUpService.errorPopup(error);
            }
          });
        },

        /**
         * @ngdoc method
         * @method postCameraUpload
         * @description
         * Post image function
         *
         * @param   {String}  photoTitle Image object
         * @param   {Array}  tagItems tag items array
         */
        postCameraUpload: function (photoTitle, tagItems) {
          var user = ProfileService.getProfile();
          var date = new Date();
          var newPostRef = ref.child('posts').push();
          var newPostKey = newPostRef.key();
          var updatedUserData = {};
          updatedUserData['userProfile/' + user.$id + '/posts/' + newPostKey] = {
            date: 0 - Date.now(),
            imageId: newPostKey
          };
          var fanPostObj = {
            createdAt: 0 - Date.now(),
            imageId: newPostKey,
            gridId: 1,
            user: user.$id
          };
          this.fanPost(fanPostObj);
          updatedUserData['userProfile/' + user.$id + '/userLevel/'] = (user.userLevel + 1);
          updatedUserData['posts/' + newPostKey] = {
            image: PostItemService.returnImage(),
            fbTimestamp: Firebase.ServerValue.TIMESTAMP,
            timestamp: date,
            createdAt: 0 - Date.now(),
            user: user.$id,
            itemTitle: photoTitle,
            imageKey: newPostKey,
            gridId: 1,
            viewImageCount: 0,
            likeCount: 0,
            wardrobeCount: 0,
            visible: true,
            origWidth: PositionService.returnDeviceWidth(),
            origHeight: PositionService.returnDeviceWidth()
          };
          //post to all followers timelines

          // Do a deep-path update
          ref.update(updatedUserData, function (error) {
            if (error) {
              console.log('Error updating data:', error);
              PopUpService.errorPopup(error);
            }
          });
          var items = tagItems;
          var x;
          for (x in items) {
            var postsRef = new Firebase(FIREBASE_URL + '/posts/' + newPostKey + '/tags/');
            var itemPostRef = postsRef.push();
            itemPostRef.set({
              itemName: items[x].itemName,
              itemIcon: items[x].itemIcon,
              itemSex: items[x].sex,
              itemDescription: items[x].itemDescription,
              positionX: items[x].leftPosition,
              positionY: items[x].topPosition,
              style: items[x].style
            });
          }
        },

        /**
         * @ngdoc method
         * @method fanPost
         * @description
         * Post image to other follwers timelines
         *
         * @param   {Object}  post Post object
         */
        fanPost: function (post) {
          var userId = ProfileService.getProfileId();
          var followersRef = $firebaseHelper.ref('/userProfile/' + userId + '/friend/');
          function fanoutPost(followersSnaphot, post) {
            var followers = Object.keys(followersSnaphot);
            var fanOutObj = {};
            followers.forEach((function () {
              return function (key) {
                return fanOutObj['/timelines/' + key + '/' + post.imageId] = post;
              };
            })(this));
            rootRef.update(fanOutObj);
          }
          followersRef.on('value', function (snapshot) {
            fanoutPost(snapshot.val(), post);
          });

        },

        /**
         * @ngdoc method
         * @method deleteFanPost
         * @description
         * Delete posts
         *
         * @param   {Object}  postId Post object
         */
        deleteFanPost: function (postId) {
          var user = ProfileService.getProfile();
          var followersRef = $firebaseHelper.ref('/userProfile/' + user.$id + '/friend/');
          followersRef.on('value', function (snapshot) {
            fanoutPost(snapshot.val(), postId);
          });
          function fanoutPost(followersSnaphot, postId) {
            var followers = Object.keys(followersSnaphot);
            var fanoutObj = {};
            followers.forEach((function () {
              return function (key) {
                return fanoutObj['/timelines/' + key + '/' + postId] = null;
              };
            })(this));
            rootRef.update(fanoutObj);
          }


        },

        /**
         * @ngdoc method
         * @method deleteUserItems
         * @description
         * Delete image popup service. Its actually a popover function but was moved here due to error with
         * circular dependency between popover service and post service
         *
         * @param   {String}  userObjId User object id
         * @param   {String}  itemKey Item key id
         * @param   {Number}  index index for selecting what to delete
         * @param   {String}  urlString used for likes and wardrobe
         */
        deleteUserItems: function(userObjId, itemKey, index, urlString){
          function fanoutPost(followersSnaphot, postId) {
            var followers = Object.keys(followersSnaphot);
            var fanoutObj = {};
            followers.forEach((function () {
              return function (key) {
                return fanoutObj['/timelines/' + key + '/' + postId] = null;
              };
            })(this));
            rootRef.update(fanoutObj);
          }
          var deleteObject = $ionicPopup.show({
            cssClass: 'delete-image-popver',
            title: 'Are you sure?',
            subTitle: 'This removes the image permanently',
            buttons: [{
              text: '<b>Keep it</b>',
              type: 'button-accent-full',
              onTap: function () {

              }
            }, {
              text: 'Delete image',
              type: 'button-primary-full',
              onTap: function () {
                if(index == 1){
                  // delete items in outfits from user profile

                  var onComplete = function(error) {
                    if (error) {
                      //this.errorPopup(error);
                    } else {

                      var outfitObject = {};
                      outfitObject['/userProfile/' + userObjId + '/posts/' + itemKey] = null;
                      ref.update(outfitObject, function (error) {
                        if (error) {
                          console.log('Error updating data:', error);
                          PopUpService.errorPopup(error);
                        }
                      });
                      var deleteRef = new Firebase(FIREBASE_URL + '/userProfile/' + userObjId + '/posts/' + itemKey);
                      deleteRef.remove();

                      // copied deleteFanPost function here as 'this' function was causing an error
                      var followersRef = $firebaseHelper.ref('/userProfile/' + userObjId + '/friend/');
                      followersRef.on('value', function (snapshot) {
                        fanoutPost(snapshot.val(), itemKey);
                      });

                      ToastService.redToast(1);
                    }
                  };
                  var imageRef = new Firebase(FIREBASE_URL + '/posts/' + itemKey);
                  imageRef.update({ visible: false }, onComplete);
                  ToastService.redToast(1);


                } else if (index == 2) {
                  // delete items in wardrobe and likes from user profile
                  var removeObject = {};
                  removeObject['/userProfile/' + userObjId + urlString + itemKey] = null;
                  removeObject['/posts/' + itemKey + '/upVote/' + userObjId] = null;
                  ref.update(removeObject, function (error) {
                    if (error) {
                      console.log('Error updating data:', error);
                      PopUpService.errorPopup(error);
                    }
                  });
                  ToastService.redToast(1);
                } else if (index == 3){
                  // delete items in timeline feed from user profile
                  var outfitObject = {};
                  outfitObject['/timelines/' + '/' + userObjId + '/' + itemKey] = null;
                  ref.update(outfitObject, function (error) {
                    if (error) {
                      console.log('Error updating data:', error);
                      PopUpService.errorPopup(error);
                    }
                  });
                  ToastService.redToast(3);
                }

              }
            }]
          });

          deleteObject.then(function () {

            // clear delete screen
            $rootScope.imageDeleteKey = false;
            return false;
          });
        }


      };
    }]);
