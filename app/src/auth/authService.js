var Rx = require('rx');
var hello = require('hellojs');

var AuthService = function(httpService, jwtHelper){

  var that = this;

  this.loginSubject = new Rx.Subject();
  this.logoutSubject = new Rx.Subject();
  this.signupSubject = new Rx.Subject();
  this.googleSubject = new Rx.Subject();
  //this.tokenSubject = new Rx.Subject();

  this.initRequest = function(){

    return Rx.Observable.create(function(o){
      var id_token = localStorage.getItem('id_token');

      if(id_token){
        var payload = jwtHelper.decodeToken(id_token);
        o.onNext({authenticated: true, username: payload.sub, id: payload.sub, permissions: payload.permissions});
      } else {
        o.onNext({authenticated: false});
      }
      o.onCompleted();
    });
  };

  this.loginRequest = function(model){
    var req = {
      method: 'POST',
      url: '/api/login',
      data: model
    };

    return httpService
      .request(req)
      .selectMany(function(){
        return that.initRequest()
      })
      .catch(function(e){return Rx.Observable.return({authenticated: false})});

  };

  this.logoutRequest = function(){

    return Rx.Observable.create(function(o){
      localStorage.removeItem('id_token');
      o.onNext({authenticated: false});
      o.onCompleted();
    });
  };

  var login = this.loginSubject
    .selectMany(function(m){
        return that.loginRequest(m).takeUntil(that.loginSubject);
    });

  var logout = this.logoutSubject
    .selectMany(function(){
        return that.logoutRequest().takeUntil(that.logoutSubject);
    });

  var init = Rx.Observable.return({})
    .selectMany(function(){
      return that.initRequest()
    });

  var google = this.googleSubject
    .selectMany(function(_){
      return that.googleRequest().takeUntil(that.googleSubject);
    });

  var token = google
    .select(function(r){
      localStorage.setItem('id_token', r.id_token);
      var payload = jwtHelper.decodeToken(r.id_token);
      return {authenticated: true, username: payload.sub, id: r._id, permissions: payload.permissions};
    })

  this.googleRequest = function(){
    var token = Rx.Observable.create(function(o){
      hello('google').login().then(function(){
        var status = hello('google').getAuthResponse();
        var token = status.access_token;
        o.onNext(token);
        o.onComplete();
      });
    });

    return token
      .selectMany(function(t){
        var req = {
          method: 'POST',
          url: 'http://auth.django-starter.dev.com/google/',
          data: {access_token: t}
        };

        return httpService
          .request(req);
      });
  };

  this.signupRequest = function(model){
    var req = {
      method: 'POST',
      url: '/api/users',
      data: model
    };

    return httpService.request(req)
      .selectMany(function(){
        return that.initRequest();
      })
      .catch(function(e){return Rx.Observable.return({authenticated: false, error: e});});
  };

  var signup = this.signupSubject
    .selectMany(function(m){
      return that.signupRequest(m).takeUntil(that.signupSubject)
    }).publish();

  this.signupUpdates = signup.asObservable();
  signup.connect();

  var authUpdatesSubject = Rx.Observable.merge(token, login, logout, init, signup
    .where(function(s){return s.success}))
    .multicast(new Rx.ReplaySubject(1));

  this.authUpdates = authUpdatesSubject.asObservable();
  authUpdatesSubject.connect();

  this.login = function(model){
    this.loginSubject.onNext(model);
  };

  this.logout = function(){
    this.logoutSubject.onNext();
  };

  this.signup = function(model){
    this.signupSubject.onNext(model)
  }

  this.google = function(){
    this.googleSubject.onNext({});
  };
};

module.exports = AuthService;
