var _ = require('lodash');

module.exports = function($httpProvider, jwtInterceptorProvider){

  jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http){
    var idToken = localStorage.getItem('id_token');
    var refreshToken = localStorage.getItem('refresh_token');

    if(!idToken){
      return null;
    }

    if (jwtHelper.isTokenExpired(idToken)) {
      // This is a promise of a JWT id_token
      return $http({
        url: '/delegation',
        // This makes it so that this request doesn't send the JWT
        skipAuthorization: true,
        method: 'POST',
        data: {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }
      }).then(function(response) {
        var id_token = response.data.id_token;
        localStorage.setItem('id_token', id_token);
        return id_token;
      });
    } else {
      return idToken;
    }
  };

  $httpProvider.interceptors.push('jwtInterceptor');

  //$httpProvider.defaults.withCredentials = true;

  var convertDatesToUtc = function(obj){
    _.forIn(obj, function(value, key){
      if(_.isDate(value)){
        obj[key] = new Date(value.getTime() - value.getTimezoneOffset() * 60000)
      }
      if(_.isObject(value)){
        convertDatesToUtc(value);
      }
    });
  };

  var parseDatesAndConvertToLocal = function(obj){

    iso8601RegEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/

    _.forIn(obj, function(value, key){
      if(_.isString(value) && iso8601RegEx.test(value)){
        var date = new Date(value);
        obj[key] = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
      }
      if(_.isObject(value)){
        parseDatesAndConvertToLocal(value);
      }
      if(_.isArray(value)){
        _.forEach(value, parseDatesAndConvertToLocal);
      }
    });
  };

  $httpProvider.interceptors.push(
    function($q){
      return {
        request: function(req){
          if(req.data){
            convertDatesToUtc(req.data);
          }
          if(req.params){
            convertDatesToUtc(req.params);
          }
          return req;
        },
        response: function(res){
          if(res.data){
            parseDatesAndConvertToLocal(res.data);
          }
          return res;
        }
      }
    }
  )
}
