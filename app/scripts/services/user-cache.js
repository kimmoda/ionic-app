'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:UserCache
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Allows user data into news feed posts
 *
 */

angular.module('Outfitpic.Service.UserCache', [])
    .factory('UserCache', ['$firebaseObject', 'FIREBASE_URL',
        function($firebaseObject, FIREBASE_URL) {

        var ref = new Firebase(FIREBASE_URL + '/userProfile/');

        return {

            getCachedUserProfiles: function() {
                var cachedUserProfiles = {};
                // loads one user into the local cache, you do not need to
                // wait for this to show it in your view, Angular and Firebase
                // will work out the details in the background
                cachedUserProfiles.$load = function(id) {
                    if (!cachedUserProfiles.hasOwnProperty(id)) {
                        cachedUserProfiles[id] = $firebaseObject(ref.child(id));
                    }
                    return cachedUserProfiles[id];
                };
                // frees memory and stops listening on user objects
                // use this when you switch views in your SPA and no longer
                // need this list
                cachedUserProfiles.$dispose = function() {
                    angular.forEach(cachedUserProfiles, function(user) {
                        user.$destroy();
                    });
                };
                // removes one user, note that the user does not have
                // to be cached locally for this to work
                cachedUserProfiles.$remove = function(id) {
                    delete cachedUserProfiles[id];
                    ref.child(id).remove();
                };
                return cachedUserProfiles;
            }
        };
    }]);
