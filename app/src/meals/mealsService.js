var Rx = require('rx');
var _ = require('lodash');

function MealsService(httpService){
  var that = this;

  var querySubject = new Rx.Subject();
  var loadSubject = new Rx.Subject();
  var deleteSubject = new Rx.Subject();
  var editSubject = new Rx.Subject();

  var editUpdatesSubject = editSubject
    .selectMany(function(m){
      var put = {
        method: 'PUT',
        url: '/api/meals/' + m.id,
        data: m
      }
      return httpService.request(put)
        .select(function(){ return {success: true, id: m.id};})
        .takeUntil(editSubject.where(function(m2){m2.id === m.id}));
    }).publish();

  editUpdatesSubject.connect();

  var updatesSubject = Rx.Observable.return({})
    .merge(querySubject)
    .selectMany(function(q){
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
            //o.onCompleted();
          }
        };

        cd.add(Rx.Observable.return({})
          .merge(loadSubject)
          .selectMany(function(){
            loading = true;
            next();
            var req = {
              method: 'GET',
              url: 'http://api.django-starter.dev.com/hello/',
              params: _.merge(q, { skip: skip, take: take})
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
              url: '/api/meals/' + id
            };
            return httpService.request(req).select(function(){return id;});
          }).subscribe(function(id){
            _.remove(results, function(r){return r._id === id});
            next();
          }));

        return cd;
        }).takeUntil(querySubject);

      }
    );

  this.updates = updatesSubject.asObservable();

  this.editUpdates = function(id){

    var get = {
      method: 'GET',
      url: '/api/meals/' + id
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

  this.query = function(model){
    querySubject.onNext(model);
  };

  this.edit = function(model){
    editSubject.onNext(model);
  };



}

module.exports = MealsService;
