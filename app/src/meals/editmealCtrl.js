module.exports = function($scope, $state, $stateParams, mealsService){

  var cd = new Rx.CompositeDisposable();
  $scope.$on('$destroy', function(){cd.dispose();});

  cd.add(mealsService.editUpdates($stateParams.id)
    .subscribe(function(r){
      if(r.success){
        $state.go('root.meals');
      }

      $scope.date = new Date(r.datetime);
      $scope.time = new Date(r.datetime);
      $scope.description = r.description;
      $scope.calories = r.calories;
      $scope.enabled = true;
    }));

  $scope.submit = function(){

    var model = {
      id: $stateParams.id,
      datetime: new Date(
        $scope.date.getFullYear(),
        $scope.date.getMonth(),
        $scope.date.getDate(),
        $scope.time.getHours(),
        $scope.time.getMinutes(),
        $scope.time.getSeconds()),
      description: $scope.description,
      calories: $scope.calories
    };

    mealsService.edit(model);

  };


};
