var Rx = require('rx');
var _ = require('lodash');

var RootCtrl = function($scope, authService, $state){
  var cd = new Rx.CompositeDisposable();
  $scope.$on('$destroy', function(){cd.dispose();});

  cd.add(authService.authUpdates.subscribe(function(r){
    if(!r.authenticated){
      $state.go('login');
    } else {
      $scope.username = r.username;
      $scope.canManageUsers = _.includes(r.permissions, 'manage_users');
    }
  }));

  $scope.logout = function(){
    authService.logout();
  };
};

module.exports = RootCtrl;
