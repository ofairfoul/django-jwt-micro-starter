var hello = require('hellojs');
var auth = angular.module('calortrak.app.auth', []);

auth.config(function($stateProvider, $urlRouterProvider){

  $stateProvider.state('login', {
      templateUrl: require('./login.html'),
      controller: require('./loginCtrl'),
      url: '/login'});

    $stateProvider.state('signup', {
        templateUrl: require('./signup.html'),
        controller: require('./signupCtrl'),
        url: '/signup'});

    $stateProvider.state('redirect', {
      url: 'reirect/:provider',
      controller: require('./redirectCtrl')
    })
});

auth.service('authService', require('./authService'));

auth.run(function(){
  hello.init({
    google: '105677703827-nmh0it88f4tscb8tt2hjo27kjum2aut7.apps.googleusercontent.com'
  }, {redirect_uri: 'redirect.html'});
});

module.exports = auth.name;
