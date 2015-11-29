var Rx = require('rx');

module.exports = function($scope, usersService){
  var cd = new Rx.CompositeDisposable();

  cd.add(usersService.updates.subscribe(function(r){
    $scope.loading = r.loading;
    $scope.users = r.results;
    $scope.end = r.end;
  }));

  $scope.$on('$destroy', function(){cd.dispose();});

  $scope.delete = function(id){
    usersService.delete(id);
  };

};
