'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.constant:FIREBASE_URL
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc constant
 * @description FIREBASE URL for whole application
 *
 */

angular.module('Outfitpic.Constant.Locations', [])

	.constant('LOCATIONS', {
        CAMERA: 'camera.camera-picture',
        CHANGEPASSWORD: 'startapp.changepassword',
        CONNECTIONS: 'inapp.activities.connection',
        DELETE: 'feedback.delete-reason',
        DISCOVERFEED: 'inapp.discover-feed',
        DISCOVERGRID: 'inapp.discover-grid',
        DISCOVERIMAGE: 'inapp.discover-grid-image',
        DISCOVERUSERPROFILE: 'inapp.item-grid-user-profile',
        DISCOVERUSERPROFILEWARDROBE: 'inapp.item-grid-user-profile.wardrobe',
        DISCOVERUSERPROFILEOUTFITS: 'inapp.item-grid-user-profile.outfits',
        DISCOVERUSERPROFILELIKES: 'inapp.item-grid-user-profile.likes',
        DISCOVERIMAGECOMMENTS: 'inapp.discover-grid-item-comments',
        FORGOT: 'startapp.forgotpassword',
        LOGIN: 'startapp.login',
        MAINPROFILEOUTFITS: 'inapp.profile.outfits',
        MAINPROFILEWARDROBE: 'inapp.profile.wardrobe',
        MAINPROFILELIKES: 'inapp.profile.likes',
        MAINPROFILEUSER: 'inapp.profile-selected-image-user',
        MAINPROFILEUSEROUTFITS: 'inapp.profile-selected-image-user.outfits',
        MAINPROFILEUSERWARDROBE: 'inapp.profile-selected-image-user.wardrobe',
        MAINPROFILEUSERLIKES: 'inapp.profile-selected-image-user.likes',
        MAINPROFILEIMAGE: 'inapp.profile-selected-image',
        MAINPROFILECOMMENTS: 'inapp.profile-selected-image-comments',
        MYFEEDIMAGE: 'inapp.myfeed.selected-image',
        MYFEEDUSER: 'inapp.myfeed.selected-user',
        MYFEEDUSEROUTFITS: 'inapp.myfeed.selected-user.outfits',
        MYFEEDUSERWARDROBE: 'inapp.myfeed.selected-user.wardrobe',
        MYFEEDUSERLIKES: 'inapp.myfeed.selected-user.likes',
        MYFEEDGRID: 'inapp.myfeed.grid',
        MYFEEDCOMMENTS: 'inapp.myfeed.selected-item-comments',
        NOTIFICATIONIMAGE: 'inapp.activities.notification-image',
        NOTIFICATIONUSER: 'inapp.activities.selected-user',
        NOTIFICATIONOUTFITS: 'inapp.activities.selected-user.outfits',
        NOTIFICATIONLIKES: 'inapp.activities.selected-user.likes',
        NOTIFICATIONWARDROBE: 'inapp.activities.selected-user.wardrobe',
        NOTIFICATIONCOMMENTS: 'inapp.activities.notification-item-comments',
        NOTIFICATIONS: 'inapp.activities.notification',
        SETTINGS: 'inapp.settings',
        SETUP: 'setupapp.profile-setup',
        SETUPERROR: 'setupapp.profile-setup-error',
        SIGNUP: 'startapp.signup',
        REGISTRATIONS: 'startapp.registration',
        WALKTHROUGH: 'startapp.walkthrough'
    });
