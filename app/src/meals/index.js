var meals = angular.module('calortrak.app.meals', []);

meals.service('mealsService', require('./mealsService'));

meals.config(function($stateProvider, $urlRouterProvider){

  	$stateProvider.state('root.meals', {
      templateUrl: require('./meals.html'),
      controller: require('./mealsCtrl'),
      url: '/meals'});

    $stateProvider.state('root.addmeal', {
      templateUrl: require('./addmeal.html'),
      controller: require('./addmealCtrl'),
      url: '/meals/add'});

    $stateProvider.state('root.editmeal', {
      templateUrl: require('./editmeal.html'),
      controller: require('./editmealCtrl'),
      url: '/meals/edit/:id'});
});

module.exports = meals.name;
