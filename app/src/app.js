require('angular');
require('datejs');
require('./styles.less');

var app = angular.module('calortrak.app', [
  require('angular-ui-router'),
  require('angular-jwt'),
  require('./meals'),
  require('./auth'),
  require('./data'),
  require('./settings'),
  require('./users')
]);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider){
	$stateProvider.state('root', {
      templateUrl: require('./root.html'),
      abstract: true,
      controller: require('./rootCtrl')});

	$urlRouterProvider.otherwise('/meals');
});

app.config(require('./httpInterceptor'));
