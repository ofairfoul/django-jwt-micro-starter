var Rx = require('rx');

module.exports = function($scope, mealsService, settingsService, authService){

  var cd = new Rx.CompositeDisposable();

  cd.add(mealsService.updates.subscribe(function(r){
    $scope.loading = r.loading;
    $scope.meals = r.results;
    $scope.end = r.end;
  }));

  cd.add(settingsService.updates.subscribe(function(r){
    $scope.maxDayCalories = r.maxDayCalories;
  }));

  cd.add(authService.authUpdates.where(function(r){return r.authenticated}).subscribe(function(r){
    $scope.showUserColumn = _.includes(r.permissions, 'view_other_meals');
    $scope.canAddMeal = _.includes(r.permissions, 'add_meal');
  }));

  $scope.$on('$destroy', function(){cd.dispose();});

  $scope.loadMore = function(){
    mealsService.loadMore();
  };

  $scope.delete = function(id){
    mealsService.delete(id);
  };

  $scope.filter = function(){
    var model = {
      dateFrom: $scope.dateFrom || undefined,
      dateTo: $scope.dateTo ? $scope.dateTo.add({days:1}) : undefined,
      timeFrom: $scope.timeFrom || undefined,
      timeTo: $scope.timeTo || undefined
    };

    mealsService.query(model);
  };
};
