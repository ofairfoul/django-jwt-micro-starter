function EdituserCtrl($scope, $state, $stateParams, usersService){

  var cd = new Rx.CompositeDisposable();
  $scope.$on('$destroy', function(){cd.dispose();});

  cd.add(usersService.editUpdates($stateParams.id)
    .subscribe(function(r){
      if(r.success){
        $state.go('root.users');
      }

      $scope.username = r.username;
      $scope.role = r.role;
    }));

  $scope.submit = function(){
    usersService.edit({
      id: $stateParams.id,
      role: $scope.role
    });
  }
}

module.exports = EdituserCtrl;
