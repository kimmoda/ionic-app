'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.config:RoutesConfig
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc function
 * @description State provider to navigate through the app
 *
 */


angular.module('Outfitpic.Config.Routes', [])

  .config(function ($httpProvider, $stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('startapp', {
        url: '/startapp',
        abstract: true,
        templateUrl: 'templates/start-app.html'
      })

      /////////////////////////////// WALKTHROUGH //////////////////////////////////////////////////////////////////////
      .state('startapp.walkthrough', {
        url: '/walkthrough',
        views: {
          'startAppContent': {
            templateUrl: 'templates/views/startapp-walkthrough.html',
            controller: 'WalkthroughController'
          }
        }
      })

      /////////////////////////////// LOGIN SECTION ////////////////////////////////////////////////////////////////////
      .state('startapp.signup', {
        url: '/signup',
        views: {
          'startAppContent': {
            templateUrl: 'templates/views/startapp-signup.html',
            controller: 'LoginController'
          }
        }
      })
      .state('startapp.registration', {
        url: '/registration',
        views: {
          'startAppContent': {
            templateUrl: 'templates/views/startapp-registration.html'
          }
        }
      })
      .state('startapp.login', {
        url: '/login',
        views: {
          'startAppContent': {
            templateUrl: 'templates/views/startapp-login.html'
          }
        }
      })
      .state('startapp.forgotpassword', {
        url: '/forgotpassword',
        views: {
          'startAppContent': {
            templateUrl: 'templates/views/startapp-forgot-password.html'
          }
        }
      })
      .state('startapp.changepassword', {
        url: '/changepassword',
        views: {
          'startAppContent': {
            templateUrl: 'templates/views/startapp-change-password.html',
            controller: 'ChangePasswordController'
          }
        }
      })

      /////////////////////////////// PROFILE SETUP ////////////////////////////////////////////////////////////////////
      .state('setupapp', {
        url: '/setupapp',
        abstract: true,
        templateUrl: 'templates/set-up-app.html'
      })
      .state('setupapp.profile-setup', {
        url: '/setup-profile-setup',
        views: {
          'setUpContent': {
            templateUrl: 'templates/views/setupapp-profile-setup.html',
            controller: 'ProfileSetupController'
          }
        }
      })
      .state('setupapp.profile-setup-error', {
        url: '/setup-profile-setup-error',
        views: {
          'setUpContent': {
            templateUrl: 'templates/views/setupapp-profile-setup-error.html'
            //controller: 'ProfileSetupController'
          }
        }
      })
      /////////////////////////////// INAPP ////////////////////////////////////////////////////////////////////////////
      .state('inapp', {
        url: '/inapp',
        abstract: true,
        templateUrl: 'templates/inapp.html'
      })

      ///////////////////////////// DISCOVER FEED //////////////////////////////////////////////////////////////////////
      .state('inapp.discover-feed', {
        url: '/discover-feed',
        cache: false,
        views: {
          'mainNewsfeed': {
            templateUrl: 'templates/views/inapp-discover-feed.html',
            controller: 'DiscoveryFeedController'
          }
        }
      })
      .state('inapp.discover-grid', {
        url: '/discover-feed/:grid_feed_id',
        cache: false,
        views: {
          'mainNewsfeed': {
            templateUrl: 'templates/views/inapp-discover-grid.html',
            controller: 'DiscoveryGridController'
          }
        }
      })
      .state('inapp.discover-grid-image', {
        url: '/discover-feed/selected-item/:group_id',
        cache: false,
        views: {
          'mainNewsfeed': {
            templateUrl: 'templates/views/inapp-selected-image.html',
            controller: 'SelectedImageController'
          }
        }
      })
      .state('inapp.discover-grid-item-comments', {
        url: '/discover-feed/selected-item/comments',
        cache: false,
        views: {
          'mainNewsfeed': {
            templateUrl: 'templates/views/inapp-selected-image-comments.html',
            controller: 'SelectedImageCommentsController'
          }
        }
      })
      .state('inapp.item-grid-user-profile', {
        url: '/discover-feed/user/:user_id',
        views: {
          'mainNewsfeed': {
            templateUrl: 'templates/views/inapp-user-discovergrid.html',
            controller: 'SelectedUserController'
          }
        }
      })
      .state('inapp.item-grid-user-profile.wardrobe', {
        url: '/discover-feed/user/wardrobe',
        views: {
          'userProfileTabs': {
            templateUrl: 'templates/views/inapp-user-wardrobe.html',
            controller: 'SelectedUserWardrobeController'
          }
        }
      })
      .state('inapp.item-grid-user-profile.outfits', {
        url: '/discover-feed/user/outfits',
        views: {
          'userProfileTabs': {
            templateUrl: 'templates/views/inapp-user-outfits.html',
            controller: 'SelectedUserOutfitsController'
          }
        }
      })
      .state('inapp.item-grid-user-profile.likes', {
        url: '/discover-feed/user/likes',
        views: {
          'userProfileTabs': {
            templateUrl: 'templates/views/inapp-user-likes.html',
            controller: 'SelectedUserLikesController'
          }
        }
      })
      ///////////////////////////// MY FEED ////////////////////////////////////////////////////////////////////////////
      .state('inapp.myfeed', {
        url: '/myfeed',
        views: {
          'myFeedMain': {
            templateUrl: 'templates/myfeed-app.html',
            abstract: true
          }
        }
      })
      .state('inapp.myfeed.grid', {
        url: '/myfeed/grid',
        views: {
          'myFeedMain': {
            templateUrl: 'templates/views/inapp-myfeed.html',
            controller: 'MyFeedGridController'
          }
        }
      })
      .state('inapp.myfeed.selected-image', {
        url: '/myfeed/:group_id',
        cache: false,
        views: {
          'myFeedMain': {
            templateUrl: 'templates/views/inapp-selected-image.html',
            controller: 'SelectedImageController'
          }
        }
      })
      .state('inapp.myfeed.selected-item-comments', {
        url: '/myfeed/comments',
        views: {
          'myFeedMain': {
            templateUrl: 'templates/views/inapp-selected-image-comments.html',
            controller: 'SelectedImageCommentsController'
          }
        }
      })
      .state('inapp.myfeed.selected-user', {
        url: '/myfeed/user/:user_id',
        views: {
          'myFeedMain': {
            templateUrl: 'templates/views/inapp-user-myfeed.html',
            controller: 'SelectedUserController'
          }
        }
      })
      .state('inapp.myfeed.selected-user.wardrobe', {
        url: '/myfeed/user/wardrobe',
        views: {
          'userProfileTabs': {
            templateUrl: 'templates/views/inapp-user-wardrobe.html',
            controller: 'SelectedUserWardrobeController'
          }
        }
      })
      .state('inapp.myfeed.selected-user.outfits', {
        url: '/myfeed/user/outfits',
        views: {
          'userProfileTabs': {
            templateUrl: 'templates/views/inapp-user-outfits.html',
            controller: 'SelectedUserOutfitsController'
          }
        }
      })
      .state('inapp.myfeed.selected-user.likes', {
        url: '/myfeed/user/likes',
        views: {
          'userProfileTabs': {
            templateUrl: 'templates/views/inapp-user-likes.html',
            controller: 'SelectedUserLikesController'
          }
        }
      })
      ///////////////////////////// PROFILE ////////////////////////////////////////////////////////////////////////////
      .state('inapp.profile', {
        url: '/profile',
        cache: false,
        views: {
          'mainProfile': {
            templateUrl: 'templates/views/inapp-profile.html',
            controller: 'MainProfileController',
            abstract: true
          }
        }
      })
      .state('inapp.profile.wardrobe', {
        url: '/wardrobe',
        cache: false,
        views: {
          'mainProfileTabs': {
            templateUrl: 'templates/views/inapp-profile-wardrobe.html',
            controller: 'MainProfileWardrobeController'
          }
        }
      })
      .state('inapp.profile.outfits', {
        url: '/outfits',
        cache: false,
        views: {
          'mainProfileTabs': {
            templateUrl: 'templates/views/inapp-profile-outfits.html',
            controller: 'MainProfileOutfitsController'
          }
        }
      })
      .state('inapp.profile.likes', {
        url: '/likes',
        cache: false,
        views: {
          'mainProfileTabs': {
            templateUrl: 'templates/views/inapp-profile-likes.html',
            controller: 'MainProfileLikesController'
          }
        }
      })
      .state('inapp.profile-friends-list', {
        url: '/friends',
        views: {
          'mainProfile': {
            templateUrl: 'templates/views/inapp-profile-friends-list.html',
            controller: 'MainProfileFriendsController'
          }
        }
      })
      .state('inapp.profile-selected-image', {
        url: '/details/:group_id',
        cache: false,
        views: {
          'mainProfile': {
            templateUrl: 'templates/views/inapp-selected-image.html',
            controller: 'SelectedImageController'
          }
        }
      })
      .state('inapp.profile-selected-image-comments', {
        url: '/details/comments',
        cache: false,
        views: {
          'mainProfile': {
            templateUrl: 'templates/views/inapp-selected-image-comments.html',
            controller: 'SelectedImageCommentsController'
          }
        }
      })
      ///////////////////////////// SELECTED USER PROFILE ///////////////////////////////////////////////////////////////
      .state('inapp.profile-selected-image-user', {
        url: '/user/:user_id',
        cache: false,
        views: {
          'mainProfile': {
            templateUrl: 'templates/views/inapp-user-main-profile.html',
            controller: 'SelectedUserController',
            abstract: true
          }
        }
      })
      .state('inapp.profile-selected-image-user.wardrobe', {
        url: '/user/wardrobe',
        cache: false,
        views: {
          'userProfileTabs': {
            templateUrl: 'templates/views/inapp-user-wardrobe.html',
            controller: 'SelectedUserWardrobeController'
          }
        }
      })
      .state('inapp.profile-selected-image-user.outfits', {
        url: '/user/outfits',
        cache: false,
        views: {
          'userProfileTabs': {
            templateUrl: 'templates/views/inapp-user-outfits.html',
            controller: 'SelectedUserOutfitsController'
          }
        }
      })
      .state('inapp.profile-selected-image-user.likes', {
        url: '/user/likes',
        cache: false,
        views: {
          'userProfileTabs': {
            templateUrl: 'templates/views/inapp-user-likes.html',
            controller: 'SelectedUserLikesController'
          }
        }
      })

      /////////////////////////// SETTINGS /////////////////////////////////////////////////////////////////////////////

      .state('inapp.settings', {
        cache: false,
        url: '/profile/settings',
        views: {
          'mainProfile': {
            templateUrl: 'templates/views/inapp-profile-settings.html'
          }
        }
      })
      .state('inapp.settings-edit', {
        cache: false,
        url: '/profile/settings/edit',
        views: {
          'mainProfile': {
            templateUrl: 'templates/views/inapp-profile-settings-edit.html',
            controller: 'MainSettingsEditController'
          }
        }
      })
      .state('inapp.settings-notification', {
        url: '/profile/settings/notification',
        views: {
          'mainProfile': {
            templateUrl: 'templates/views/inapp-profile-settings-notification.html',
            controller: 'MainSettingsNotificationsEditController'
          }
        }
      })
      .state('inapp.settings-privacy', {
        url: '/profile/settings/privacy',
        views: {
          'mainProfile': {
            templateUrl: 'templates/views/inapp-profile-settings-privacy.html',
            controller: 'MainSettingsPrivacyController'
          }
        }
      })
      .state('inapp.settings-about', {
        url: '/profile/settings/about',
        views: {
          'mainProfile': {
            templateUrl: 'templates/views/inapp-profile-settings-about.html'
          }
        }
      })
      .state('inapp.settings-cancellation', {
        url: '/profile/settings/cancellation',
        views: {
          'mainProfile': {
            templateUrl: 'templates/views/inapp-profile-settings-cancellation.html'
          }
        }
      })
      .state('inapp.settings-terms', {
        url: '/profile/settings/terms',
        views: {
          'mainProfile': {
            templateUrl: 'templates/views/inapp-profile-settings-terms.html'
          }
        }
      })

      ///////////////////////////// NOTIFICATIONS //////////////////////////////////////////////////////////////////////
      .state('inapp.activities', {
        url: '/activities',
        views: {
          'activitiesFeed': {
            templateUrl: 'templates/views/inapp-activities.html',
            abstract: true
          }
        }
      })
      .state('inapp.activities.connection', {
        url: '/connection',
        views: {
          'activitiesTabs': {
            templateUrl: 'templates/views/inapp-activities-connection.html',
            abstract: true
          }
        }
      })
      .state('inapp.activities.connection.friends-request', {
        url: '/connection/friends-request',
        views: {
          'activitiesConnectionTabs': {
            templateUrl: 'templates/views/inapp-activities-connection-friends-request.html',
            controller: 'MyConnectionsController'
          }
        }
      })
      .state('inapp.activities.connection.suggested-followers', {
        url: '/connection/suggested-followers',
        views: {
          'activitiesConnectionTabs': {
            templateUrl: 'templates/views/inapp-activities-connection-suggested-followers.html',
            controller: 'MyConnectionsController'
          }
        }
      })
      .state('inapp.activities.connection.request-sent', {
        url: '/connection/request-sent',
        views: {
          'activitiesConnectionTabs': {
            templateUrl: 'templates/views/inapp-activities-connection-request-sent.html',
            controller: 'MyConnectionsController'
          }
        }
      })
      .state('inapp.activities.notification', {
        url: '/notification',
        views: {
          'activitiesTabs': {
            templateUrl: 'templates/views/inapp-activities-notification.html',
            controller: 'NotificationsController'
          }
        }
      })
      .state('inapp.activities.notification-image', {
        url: '/notification/:group_id',
        views: {
          'activitiesTabs': {
            templateUrl: 'templates/views/inapp-selected-image.html',
            controller: 'SelectedImageController'
          }
        }
      })
      .state('inapp.activities.notification-item-comments', {
        url: '/notification/comments',
        views: {
          'activitiesTabs': {
            templateUrl: 'templates/views/inapp-selected-image-comments.html',
            controller: 'SelectedImageCommentsController'
          }
        }
      })
      .state('inapp.activities.selected-user', {
        url: '/details/user/:user_id',
        views: {
          'activitiesTabs': {
            templateUrl: 'templates/views/inapp-user-notifications.html',
            controller: 'SelectedUserController'
          }
        }
      })
      .state('inapp.activities.selected-user.wardrobe', {
        url: '/details/user/wardrobe',
        views: {
          'userProfileTabs': {
            templateUrl: 'templates/views/inapp-user-wardrobe.html',
            controller: 'SelectedUserWardrobeController'
          }
        }
      })
      .state('inapp.activities.selected-user.outfits', {
        url: '/details/user/outfits',
        views: {
          'userProfileTabs': {
            templateUrl: 'templates/views/inapp-user-outfits.html',
            controller: 'SelectedUserOutfitsController'
          }
        }
      })
      .state('inapp.activities.selected-user.likes', {
        url: '/details/user/likes',
        views: {
          'userProfileTabs': {
            templateUrl: 'templates/views/inapp-user-likes.html',
            controller: 'SelectedUserLikesController'
          }
        }
      })

      ///////////////////////////// CAMERA /////////////////////////////////////////////////////////////////////////////
      .state('camera', {
        url: '/camera',
        abstract: true,
        templateUrl: 'templates/camera-app.html'
      })
      .state('camera.camera-picture', {
        url: '/camera-pics',
        views: {
          'mainCameraPics': {
            templateUrl: 'templates/views/inapp-camera-pics.html',
            controller: 'CameraController'
          }
        }
      })

      ///////////////////////////// FEEDBACK  //////////////////////////////////////////////////////////////////////////
      .state('feedback', {
        url: '/feedback',
        abstract: true,
        templateUrl: 'templates/feedback-app.html'
      })

      .state('feedback.delete-reason', {
        url: '/feedback-reason',
        views: {
          'mainFeedback': {
            templateUrl: 'templates/views/deleteapp-feedback.html'
          }
        }
      });


    // redirects to default route for undefined routes
    $urlRouterProvider.otherwise('/startapp/walkthrough');

  });

