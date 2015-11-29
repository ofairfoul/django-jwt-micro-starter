var Rx = require('rx');

module.exports = function(httpService, authService){

  var saveSubject = new Rx.Subject();

  var updatesSubject =
    Rx.Observable.merge(
      authService.authUpdates
        .where(function(a){return a.authenticated})
        .selectMany(function(a){
          var req = {
            method: 'GET',
            url: '/api/settings/' + a.id
          };
          return httpService.request(req)
        })
        .catch(function(e){return Rx.Observable.return({maxDayCalories:8000})
      }),
      saveSubject
        .selectMany(function(m){
          return authService.authUpdates
            .selectMany(function(a){
              var req = {
                method: 'PUT',
                url: '/api/settings/' + a.id,
                data: m
              };
              return httpService.request(req).select(function(){return m;})
            });
          return Rx.Observable.return(m);
        })
    ).multicast(new Rx.ReplaySubject(1));

  updatesSubject.connect();

  this.updates = updatesSubject.asObservable();

  this.save = function(model){
    saveSubject.onNext(model);
  };

}
