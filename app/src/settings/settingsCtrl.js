module.exports = function($scope, settingsService, $state){

  var cd = new Rx.CompositeDisposable();

  cd.add(settingsService.updates.subscribe(function(r){
    $scope.maxDayCalories = r.maxDayCalories;
  }));

  cd.add(settingsService.updates.skip(1).subscribe(function(){
    $state.go('root.meals');
  }));

  $scope.$on('$destroy', function(){cd.dispose();});

  $scope.submit = function(){
    settingsService.save({maxDayCalories: $scope.maxDayCalories});
  };

}
