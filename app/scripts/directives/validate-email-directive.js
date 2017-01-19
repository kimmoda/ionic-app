'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.directive:validateEmail
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc directive
 * @description Allows rege validation on emails within input fields
 *
 */
 
angular.module('Outfitpic.Driective.ValidateEmail', [])

.directive('validateEmail', function() {
  var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      // only apply the validator if ngModel is present and Angular has added the email validator
      if (ctrl && ctrl.$validators.email) {

        // this will overwrite the default Angular email validator
        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };
});
