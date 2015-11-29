var users = angular.module('calortrak.app.users', []);

users.service('usersService', require('./usersService'));

users.config(function($stateProvider){

  	$stateProvider.state('root.users', {
      templateUrl: require('./users.html'),
      controller: require('./usersCtrl'),
      url: '/users'});

    $stateProvider.state('root.edituser', {
      templateUrl: require('./edituser.html'),
      controller: require('./edituserCtrl'),
      url: '/users/edit/:id'});

});

module.exports = users.name;
