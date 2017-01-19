'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.constant:TimeZone
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc constant
 * @description Timezone config for timestamp on comment posts
 *
 */

angular.module('Outfitpic.Constant.TimeZone', [])

  .constant('angularMomentConfig', {
    preprocess: 'utc',
    timezone: 'Europe/Berlin'
  });

  moment.locale('en', {
    relativeTime : {
      future: 'in %s',
      past:   '%s',
      s:  '%ds',
      m:  '1m',
      mm: '%dm',
      h:  '1h',
      hh: '%dh',
      d:  '1d',
      dd: '%dd',
      M:  '1mon',
      MM: function (number, withoutSuffix, key, isFuture) {
        console.log('number = ' + number);
        console.log('withoutSuffix = ' + withoutSuffix);
        console.log('key = ' + key);
        console.log('isFuture = ' + isFuture);
        return 'xxx';
      },
      y:  '1y',
      yy: '%dy'
    }
  });
