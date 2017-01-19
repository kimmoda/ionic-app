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

angular.module('Outfitpic.Service.ImageCache', [])
    .factory('ImageCache', ['$firebaseObject', 'FIREBASE_URL',
        function($firebaseObject, FIREBASE_URL) {

        var ref = new Firebase(FIREBASE_URL + '/posts/');

        return {

            getCachedImageProfiles: function() {
                var cachedImageProfiles = {};
                // loads one user into the local cache, you do not need to
                // wait for this to show it in your view, Angular and Firebase
                // will work out the details in the background
                cachedImageProfiles.$load = function(id) {
                    if (!cachedImageProfiles.hasOwnProperty(id)) {
                        cachedImageProfiles[id] = $firebaseObject(ref.child(id));
                    }
                    return cachedImageProfiles[id];
                };
                // frees memory and stops listening on user objects
                // use this when you switch views in your SPA and no longer
                // need this list
                cachedImageProfiles.$dispose = function() {
                    angular.forEach(cachedImageProfiles, function(user) {
                        user.$destroy();
                    });
                };
                // removes one user, note that the user does not have
                // to be cached locally for this to work
                cachedImageProfiles.$remove = function(id) {
                    delete cachedImageProfiles[id];
                    ref.child(id).remove();
                };
                return cachedImageProfiles;
            }
        };
    }]);
