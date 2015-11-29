var SignupCtrl = function($scope, authService, $state){

  $scope.role = 'standard';

  authService.signupUpdates.subscribe(function(r){
    if(r.authenticated){
      $state.go('root.meals');
    } else {
      $scope.error = r.error;
    }
  });

  $scope.submit = function(){

    var model = {
      username: $scope.username,
      password: $scope.password,
      role: $scope.role
    };

    authService.signup(model);
  };
};

module.exports = SignupCtrl;
