var hello = require('hellojs');
var url = require('url');

module.exports = function($scope, authService, $state){

  var cd = new Rx.CompositeDisposable();
  $scope.$on('$destroy', function(){cd.dispose();});

  cd.add(authService.authUpdates.subscribe(function(r){
    if(r.authenticated){
      $state.go('root.meals');
    }
  }));

  $scope.submit = function(){
    authService.login({username:$scope.username, password:$scope.password});
  };

  /*$scope.google = function(){
    authService.google();
  };*/
  var google = {
    protocol: 'https:',
    slashes: true,
    host: 'accounts.google.com',
    pathname: '/o/oauth2/auth',
    query:{
      response_type: 'token',
      client_id: '771237274958-o91sdd3vbt5nufd2ta6olh2k9s0i3rcp.apps.googleusercontent.com',
      scope: 'profile',
      redirect_uri: 'http://127.0.0.1:8001/redirect/google'
    }
  };

  $scope.google = function(){
    authService.google();
  };

};
