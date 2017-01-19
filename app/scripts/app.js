'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Main App Module
 *
 */


angular.module('Outfitpic', [

    /////////////////////// MAIN FRAMEWORK LIBRARIES ///////////////////////////////////////////////////////////////////
    'ionic',
    'ngCordova',
    'ngResource',
    'firebaseHelper',
    'ngAnimate',
    'ngSanitize',

    /////////////////////// THIRD PARTY LIBRARIES //////////////////////////////////////////////////////////////////////
    'angular-toArrayFilter',
    'ion-autocomplete',
    'jett.ionic.filter.bar',
    'tabSlideBox',
    'jett.ionic.scroll.sista',
    'ionic-toast',
    'LocalStorageModule',
    'angularMoment',

    /////////////////////// CONTROLLERS ////////////////////////////////////////////////////////////////////////////////
    'Outfitpic.Controller.Camera',
    'Outfitpic.Controller.ChangePassword',
    'Outfitpic.Controller.DiscoveryFeed',
    'Outfitpic.Controller.DiscoveryGrid',
    'Outfitpic.Controller.ForgotPassword',
    'Outfitpic.Controller.Login',
    'Outfitpic.Controller.Logout',
    'Outfitpic.Controller.MainProfile',
    'Outfitpic.Controller.MainProfileFriends',
    'Outfitpic.Controller.MainProfileLikes',
    'Outfitpic.Controller.MainProfileOutfits',
    'Outfitpic.Controller.SelectedImage',
    'Outfitpic.Controller.SelectedImageComments',
    'Outfitpic.Controller.MainProfileWardrobe',
    'Outfitpic.Controller.MainSettingsEdit',
    'Outfitpic.Controller.MainSettingsNotificationsEdit',
    'Outfitpic.Controller.MainSettingsPrivacy',
    'Outfitpic.Controller.MyConnections',
    'Outfitpic.Controller.MyFeedGrid',
    'Outfitpic.Controller.Notifications',
    'Outfitpic.Controller.ProfileSetup',
    'Outfitpic.Controller.Registration',
    'Outfitpic.Controller.SelectedImage',
    'Outfitpic.Controller.SelectedImageComments',
    'Outfitpic.Controller.SelectedUser',
    'Outfitpic.Controller.SelectedUserLikes',
    'Outfitpic.Controller.SelectedUserOutfits',
    'Outfitpic.Controller.SelectedUserWardrobe',
    'Outfitpic.Controller.Tab',
    'Outfitpic.Controller.Topic',
    'Outfitpic.Conrtoller.Walkthrough',

    /////////////////////// CONFIG /////////////////////////////////////////////////////////////////////////////////////
    'Outfitpic.Config.FirebaseHelper',
    'Outfitpic.Config.Http',
    'Outfitpic.Config.LocalStorage',
    'Outfitpic.Constant.PushWoosh',
    'Outfitpic.Config.Routes',

    /////////////////////// DIRECTIVES /////////////////////////////////////////////////////////////////////////////////
    'Outfitpic.Directive.AutoFocus',
    'Outfitpic.Directive.AvatarTemplate',
    'Outfitpic.Directive.CustomBackdrop',
    'Outfitpic.Directive.DeleteItemTemplate',
    'Outfitpic.Directive.IonPinch',
    'Outfitpic.Directive.PasscodeValidator',
    'Outfitpic.Directive.ProfileDetailsTemplate',
    'Outfitpic.Directive.SocialIconTemplate',
    'Outfitpic.Directive.Randomtips',
    'Outfitpic.Directive.TitleHolderTemplate',
    'Outfitpic.Directive.ToggleClass',
    'Outfitpic.Driective.ValidateEmail',

    /////////////////////// SERVICES ///////////////////////////////////////////////////////////////////////////////////
    'Outfitpic.Service.Authentication',
    'Outfitpic.Service.Camera',
    'Outfitpic.Service.CheckUserService',
    'Outfitpic.Service.ClothingItems',
    'Outfitpic.Service.CommentService',
    'Outfitpic.Service.CountrySelect',
    'Outfitpic.Service.FriendsService',
    'Outfitpic.Service.ImageCache',
    'Outfitpic.Service.LoadingSpinner',
    'Outfitpic.Service.MasterData',
    'Outfitpic.Service.ModalService',
    'Outfitpic.Service.NavigationService',
    'Outfitpic.Service.Newsfeed',
    'Outfitpic.Service.NotificationService',
    'Outfitpic.Service.Popups',
    'Outfitpic.Service.PositionData',
    'Outfitpic.Service.PostItemData',
    'Outfitpic.Service.PostService',
    'Outfitpic.Service.ProfileService',
    'Outfitpic.Service.PushService',
    'Outfitpic.Service.ScrollToService',
    'Outfitpic.Service.ShareData',
    'Outfitpic.Service.ToastService',
    'Outfitpic.Service.UpdateUserLevel',
    'Outfitpic.Service.UserCache',
    'Outfitpic.Service.UserImageService',
    'Outfitpic.Service.UserService',
    'Outfitpic.Service.UserLevel',

    /////////////////////// CONSTANTS //////////////////////////////////////////////////////////////////////////////////
    'Outfitpic.Constant.FirebaseSession',
    'Outfitpic.Service.FirebaseURL',
    'Outfitpic.Constant.Locations',
    'Outfitpic.Constant.Modals',
    'Outfitpic.Constant.TimeZone'

  ])

  .run(function ($ionicPlatform, $ionicScrollDelegate, $cordovaNetwork, $ionicPopup, $cordovaCamera, $rootScope, $state,
                 $location, $timeout, User, LOCATIONS, localStorageService, $cordovaSQLite) {

    ///////////////////////////// NATIVE KEYBOARD FUNCTION /////////////////////////////////////////////////////////////
    function keyboardShowHandler(info){
      $rootScope.$broadcast('KeyboardWillShowNotification', info);
    }

    function keyboardHideHandler(info){
      $rootScope.$broadcast('KeyboardWillHideNotification', info);
    }

    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    ///////////////////////////// PUSH NOTIFICATION SERVICE ////////////////////////////////////////////////////////////
    function initPushwoosh() {
      var pushNotification = cordova.require('com.pushwoosh.plugins.pushwoosh.PushNotification');
      document.addEventListener('push-notification', function (event) {
          var notification = event.notification;
          //clear the app badge
          pushNotification.setApplicationIconBadgeNumber(0);
        }
      );
      //initialize the plugin
      pushNotification.onDeviceReady({pw_appid: '6C93A-0E548'});
      //reset badges on app start
      pushNotification.setApplicationIconBadgeNumber(0);
    }

    ///////////////////////////// USER SESSION /////////////////////////////////////////////////////////////////////////
    $rootScope.$state = $state;
    $rootScope.$on('$stateChangeSuccess',
      function(event, toState) {
        $state.current = toState;
        localStorageService.set('lastView', $state.current.name);
      }
    );


    ///////////////////////////// START USER ON LAST VIEWED ////////////////////////////////////////////////////////////
    // check logged in state and redirect to news feed in case user still in session
    var loggedInUser = User.getLoggedInUser();
     var lastViewed = localStorageService.get('lastView');
     if (!loggedInUser && !lastViewed) { 
       $state.go(LOCATIONS.WALKTHROUGH);
      } else if(lastViewed == LOCATIONS.SETUP){ 
       $state.go(LOCATIONS.LOGIN); 
    }  else if(lastViewed != LOCATIONS.SETUP){
       $state.go(lastViewed);
     } else{
       $state.go(LOCATIONS.LOGIN);
     }

    $ionicPlatform.ready(function () {

      ///////////////////////////// SQL LITE INIT //////////////////////////////////////////////////////////////////////
      db = $cordovaSQLite.openDB({name: 'my.db', location: 2});
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Messages (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT)');


      ///////////////////////////// HACKS //////////////////////////////////////////////////////////////////////////////
      // deals with scroll issue bug
      $ionicScrollDelegate.scrollTop();

      // deals with white screen issue during app startup
      setTimeout(function () {
        navigator.splashscreen.hide();
      }, 100);

      // iOS keyboard accessory codes
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      ///////////////////////////// PUSHWOOSH INIT /////////////////////////////////////////////////////////////////////
      // init pushwoosh service
      initPushwoosh();

      ///////////////////////////// WIFI STATUS SERVICE ////////////////////////////////////////////////////////////////
      // checks online status
      function displayWarningModal() {
        $ionicPopup.show({
          templateUrl: 'templates/views/popup/poor-connection.html',
          cssClass: 'poor-connection-popover',
          title: 'Lorem Ipsum dolor imit',
          subTitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, quos!'
        });
      }


      ///////////////////////////// INACTIVITY FUNCTION ////////////////////////////////////////////////////////////////
      document.addEventListener("deviceReady", function () {
        document.addEventListener("resume", function () {
          $timeout(function () {
            // go to state after user comes back to the app
            $state.go(lastViewed);
          }, 0);
        }, false);
      });




    });

    // add possible global event handlers
    var db = null;

  });

