'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.controller:DiscoveryFeedController
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc controller
 * @description Shows lists of feed available coming from Master data
 *              in Firebase. ID is passed from the selection into item grid controller
 *
 */

angular.module('Outfitpic.Controller.DiscoveryFeed', [])
  .controller('DiscoveryFeedController', ['$scope', 'UserLevel' , '$state', '$stateParams', '$firebaseArray',
              'MasterDataService', '$timeout', '$interval', 'LOCATIONS', 'localStorageService',
    function ($scope, UserLevel, $state , $stateParams, $firebaseArray,  MasterDataService, $timeout, $interval,
              LOCATIONS, localStorageService) {

      //////////////////////// USER LEVEL DETECTION ////////////////////////////////////////////////////////////////////
      // Checks the user level allowing to show tutorials on pages
      UserLevel.checkUserLevel();

      //////////////////////// SET ROOT STATE //////////////////////////////////////////////////////////////////////////
      // Sets the root state within local storage
      localStorageService.set('rootState', $state.current.name);

      /////////////////////////////// INFINITE LIST ////////////////////////////////////////////////////////////////////
      var baseRef = MasterDataService.getNewsFeedRef();
      var scrollRef = new Firebase.util.Scroll(baseRef, 'createdAt');
      $scope.newsItems = $firebaseArray(scrollRef);
      scrollRef.scroll.next(4);
      $scope.noMoreItemsAvailable = false;
      $scope.count = 0;
      $scope.isListAmountUnknown = true;

      /**
       * @ngdoc function
       * @function loadMore
       * @description
       * Infinite scroll function to load more items when user gets to the bottom fo the screen
       *
       */
      $scope.loadMore = function () {
        $scope.loadMoreItems = true;
        scrollRef.scroll.next(4);
        if ($scope.isListAmountUnknown) {
          MasterDataService.calculateNewsFeedLength(function (amount) {
            $scope.count = amount;
            $scope.isListAmountUnknown = false;
          });
        } else {
          if ($scope.newsItems.length == $scope.count) {
            $scope.noMorePlaceholder = true;
            $scope.noMoreItemsAvailable = true;
          }
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      /////////////////////////////// SLIDESHOW ON DIVS ////////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function callAtInterval
       * @description
       * Interval function to enable slideshow to change image
       *
       */
      function callAtInterval() {
        $scope.randomQuote = $scope.quotes[Math.floor(Math.random() * $scope.quotes.length)];
        if($scope.imageHolder1 === true){
          $scope.imageHolder1 = false;
          $scope.imageHolder2 = true;
        } else if($scope.imageHolder2 === true) {
          $scope.imageHolder1 = true;
          $scope.imageHolder2 = false;
        }
      }

      // Slide show function
      $scope.quotes = [{
        value: 0
      }, {
        value: 1
      }, {
        value: 2
      }, {
        value: 3
      }];

      // Scope variables for ng-if on slideshow containers
      $scope.imageHolder1 = true;
      $scope.imageHolder2 = false;
      $timeout(function() {
        $scope.interval = $interval(callAtInterval, 10000);
      });

      /**
       * @ngdoc function
       * @function loadMore
       * @description
       * Infinite scroll function to load more items when user gets to the bottom fo the screen
       *
       * @param  {Object} event   Event object
       * @param  {Object} toState toState object
       */

      $scope.$on('$stateChangeStart', function(event, toState){
        if(toState.name !== LOCATIONS.DISCOVERFEED){
          // stops slideshow when user leaves the feed section
          $interval.cancel($scope.interval);
        }
      });


      $scope.randomQuote = {};
      $scope.randomQuote.value = 0;

      /**
       * @ngdoc function
       * @function getImage
       * @description
       * Retrieve image object from Firebase
       *
       * @param  {Object} item toState object
       *
       */
      $scope.getImage = function(item){
        return item.images[$scope.randomQuote.value];
      };

      ///////////////////////////////// VIEW FEED SELECTED /////////////////////////////////////////////////////////////
      /**
       * @ngdoc function
       * @function viewFeed
       * @description
       * View grid from feed selected
       *
       * @param  {String} feedId toState object
       */
      $scope.viewFeed = function (feedId) {
        $state.go(LOCATIONS.DISCOVERGRID, {grid_feed_id: feedId});
        localStorageService.set('gridId', feedId);
        localStorageService.set('previousState', $state.current.name);
      };


    }]);
