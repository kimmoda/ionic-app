'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:Authentication
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Authentication service which deals with registration, login and change of password
 *
 */

angular.module('Outfitpic.Service.Authentication', [])
  .factory('Authentication', ['$firebaseHelper', '$q', 'FIREBASE_URL', 'FIREBASE_SESSION', 'User', 'localStorageService',
    function ($firebaseHelper, $q, FIREBASE_URL, FIREBASE_SESSION, User, localStorageService) {

      var ref = $firebaseHelper.ref();

      var myObject = {
        /**
         * @ngdoc method
         * @method login
         * @description
         * Login function which return promise of authdata
         *
         * @param   {Object}  user User object
         * @returns {String}  authData authdata token from Firebase
         */
        login: function (user) {
          var defered = $q.defer();
          ref.authWithPassword({
            email: user.email,
            password: user.password
          }, function (error, authData) {
            if (error) {
              defered.reject(error);
            } else {
              defered.resolve(authData);
            }
          });
          return defered.promise;
        },
        /**
         * @ngdoc method
         * @method forgot
         * @description
         * Forgotten database function for users requesting temp token. User is emailed a token
         *
         * @param   {Object}  user User object
         */
        forgot: function (user) {
          var defered = $q.defer();
          ref.resetPassword({
            email: user.email
          }, function (error) {
            if (error) {
              defered.reject(error);
            } else {
              defered.resolve();
            }
          });
          return defered.promise;
        },

        /**
         * @ngdoc method
         * @method change
         * @description
         * Change users password function
         *
         * @param   {Object}  user User object
         */
        change: function (user) {
          var defered = $q.defer();
          ref.changePassword({
            email: user.email,
            oldPassword: user.token,
            newPassword: user.password
          }, function (error) {
            if (error) {
              defered.reject(error);
            } else {
              defered.resolve();
            }
          });
          return defered.promise;
        },

        /**
         * @ngdoc method
         * @method register
         * @description
         * Register user function
         *
         * @param   {Object}  user User object
         * @returns {String}  userData authdata token from Firebase
         */
        register: function (user) {
          var defered = $q.defer();
          ref.createUser({
            name: user.username,
            email: user.email,
            password: user.password
          }, function (error, userData) {
            if (error) {
              defered.reject(error);
            } else {
              defered.resolve(userData);
              var userDetails = User.newUserRef(userData);
              userDetails.username = user.username;
              userDetails.email = user.email;
              userDetails.fbTimestamp = Firebase.ServerValue.TIMESTAMP;
              userDetails.createdAt = 0 - Date.now();
              userDetails.userLevel = 0;
              userDetails.profileCompleted = false;
              userDetails.viewLikes = false;
              userDetails.viewOutfits = false;
              userDetails.viewWardrobe = false;
              userDetails.$save().then(function (success) {
                console.log(success);
              }, function (error) {
                console.log('there was an error! ' + error);
              });
            }
          });
          return defered.promise;
        },

        /**
         * @ngdoc method
         * @method registerFB
         * @description
         * Register through FaceBook function
         *
         * @returns {String}  authData authdata token from Firebase
         */
        registerFB: function () {
          var defered = $q.defer();
          ref.authWithOAuthPopup('facebook', function (error, authData) {
            if (error) {
              console.log('Login Failed!', error);
              defered.reject(error);
            } else {
              console.log('Authenticated successfully with payload:', authData);
              ref.onAuth(function (authData) {
                function userExistsCallback(userId, exists) {
                  if (exists) {
                    // If user exists logged them into app
                    console.log('user ' + userId + ' exists!');
                    defered.resolve(authData);
                  } else {
                    // Register new facebook user
                    ref.child('userProfile').child(authData.uid).set({
                      provider: authData.provider,
                      username: authData.facebook.displayName,
                      sex: authData.facebook.cachedUserProfile.gender,
                      description: '',
                      location: '',
                      email: authData.facebook.email,
                      facebookId: authData.facebook.id,
                      fbTimestamp: Firebase.ServerValue.TIMESTAMP,
                      createdAt: 0 - Date.now(),
                      userLevel: 0,
                      profileCompleted: true
                    });
                    ref.child('userProfile').child(authData.uid).update({
                      'avatar/image': authData.facebook.profileImageURL,
                      // image type for users setup profile with facebook
                      'avatar/imageType': 2,
                      'tutorial/profilePage': false
                    });

                    defered.resolve(authData);
                  }
                }
                if (authData) {
                  // Check if user exists on fireabse
                  var usersRef = new Firebase(FIREBASE_URL + '/userProfile/');
                  usersRef.child(authData.uid).once('value', function (snapshot) {
                    var exists = (snapshot.val() !== null);
                    userExistsCallback(authData.uid, exists);
                  });
                }
              });
            }
          }, {
            scope: 'email,user_likes,user_friends'
          });
          return defered.promise;
        },

        /**
         * @ngdoc method
         * @method registerTwitter
         * @description
         * Register through Twitter function
         *
         * @returns {String}  authData authdata token from Firebase
         */
        registerTwitter: function () {
          var defered = $q.defer();
          ref.authWithOAuthPopup('twitter', function (error, authData) {
            if (error) {
              console.log('Login Failed!', error);
              defered.reject(error);
            } else {
              ref.onAuth(function (authData) {
                // callback function to check if user exists
                function userExistsCallback(userId, exists) {
                  if (exists) {
                    // If user exists logged them into app
                    console.log('user ' + userId + ' exists!');
                    defered.resolve(authData);
                  } else {
                    console.log('Authenticated successfully with payload:', authData);
                    // Register new twitter user
                    ref.child('userProfile').child(authData.uid).set({
                      provider: authData.provider,
                      username: authData.twitter.username,
                      description: authData.twitter.cachedUserProfile.description,
                      location: authData.twitter.cachedUserProfile.location,
                      twitterId: authData.uid,
                      fbTimestamp: Firebase.ServerValue.TIMESTAMP,
                      createdAt: 0 - Date.now(),
                      userLevel: 0,
                      profileCompleted: true
                    });
                    ref.child('userProfile').child(authData.uid).update({
                      'avatar/image': authData.twitter.profileImageURL,
                      // image type for users setup profile with twitter
                      'avatar/imageType': 2,
                      'tutorial/profilePage': false
                    });
                    defered.resolve(authData);
                  }
                }
                if (authData) {
                  // Check if user exists on fireabse
                  var usersRef = new Firebase(FIREBASE_URL + '/userProfile/');
                  usersRef.child(authData.uid).once('value', function (snapshot) {
                    var exists = (snapshot.val() !== null);
                    userExistsCallback(authData.uid, exists);
                  });
                }
              });
              defered.resolve(authData);
            }
          }, {
            remember: 'sessionOnly',
            scope: 'email,user_likes'
          });
          return defered.promise;
        },

        /**
         * @ngdoc method
         * @method logout
         * @description
         * Logout function
         *
         * @returns {String} unauth token from Firebase
         */
        logout: function () {
          return ref.unauth();
        }
      };

      return myObject;

    }]);
