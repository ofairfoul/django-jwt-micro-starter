module.exports = function($scope, httpService, $state){

  var sd = new Rx.SerialDisposable();
  $scope.$on('$destroy', function(){sd.dispose();});

  $scope.date = Date.today();
  $scope.time = Date.today().setTimeToNow().set({millisecond:0});

  $scope.submit = function(){

    var req = {
      method: 'POST',
      url: '/api/meals',
      data: {
        datetime: new Date(
          $scope.date.getFullYear(),
          $scope.date.getMonth(),
          $scope.date.getDate(),
          $scope.time.getHours(),
          $scope.time.getMinutes(),
          $scope.time.getSeconds()),
        description: $scope.description,
        calories: $scope.calories,
      }
    };

    sd.setDisposable(httpService.request(req)
      .subscribe(function(){
        $state.go('root.meals');
      }));

  };


};
