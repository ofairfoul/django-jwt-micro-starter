var Rx = require('rx');
var _ = require('lodash');

function UsersService(httpService){
  var that = this;

  var loadSubject = new Rx.Subject();
  var deleteSubject = new Rx.Subject();
  var editSubject = new Rx.Subject();

  var editUpdatesSubject = editSubject
    .selectMany(function(m){
      var put = {
        method: 'PUT',
        url: '/api/users/' + m.id,
        data: m
      }
      return httpService.request(put)
        .select(function(){ return {success: true, id: m.id};});
    }).publish();

  editUpdatesSubject.connect();

  var updatesSubject = Rx.Observable.return({})
    .selectMany(function(){
      return Rx.Observable.create(function(o){

        var results = [];
        var total = -1;
        var loading = false;
        var skip = 0;
        var take = 40;
        var cd = new Rx.CompositeDisposable();

        var next = function(){

          o.onNext({
            results: results,
            loading: loading,
            end: false
          });

          if(total !== -1 && skip >= total){
            o.onNext({
              results: results,
              loading: loading,
              end: true
            });
          }
        };

        cd.add(Rx.Observable.return({})
          .merge(loadSubject)
          .selectMany(function(){
            loading = true;
            next();
            var req = {
              method: 'GET',
              url: '/api/users',
              params: { skip: skip, take: take}
            };
            return httpService.request(req);
          }).subscribe(function(r){
            skip += take;
            loading = false;
            results = results.concat(r.results);
            total = r.total;
            next();
          }));

        cd.add(deleteSubject
          .selectMany(function(id){
            var req = {
              method: 'DELETE',
              url: '/api/users/' + id
            };
            return httpService.request(req).select(function(){return id;});
          }).subscribe(function(id){
            _.remove(results, function(r){return r._id === id});
            next();
          }));

        return cd;
        });

      }
    );

  this.updates = updatesSubject.asObservable();

  this.editUpdates = function(id){

    var get = {
      method: 'GET',
      url: '/api/users/' + id
    };

    return Rx.Observable.merge(
      httpService.request(get),
      editUpdatesSubject.where(function(m){return m.id === id})
    );

  };

  this.loadMore = function(){
    loadSubject.onNext();
  };

  this.delete = function(id){
    deleteSubject.onNext(id);
  };

  this.edit = function(model){
    editSubject.onNext(model);
  };
}

module.exports = UsersService;
