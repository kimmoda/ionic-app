'use strict';
angular.module('of.translate', ['translate']).config(['$translateProvider', function ($translateProvider) {
	$translateProvider.preferredLanguage('en');
	$translateProvider.translations('de', {
			'login.name': 'Name',
			'login.password': 'Passwort'
		}
	);

	$translateProvider.translations('en', {
		'login.name': 'Name',
		'login.password': 'Password--'
	});

}]);
