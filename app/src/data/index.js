var mod = angular.module('calortrak.app.data', [])
  .service('httpService', require('./httpService'));

module.exports = mod.name;
