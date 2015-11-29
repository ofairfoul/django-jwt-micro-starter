var settings = angular.module('calortrak.app.settings', []);

settings.service('settingsService', require('./settingsService'));

settings.config(function($stateProvider){

  	$stateProvider.state('root.settings', {
      templateUrl: require('./settings.html'),
      controller: require('./settingsCtrl'),
      url: '/settings'});

});

module.exports = settings.name;
