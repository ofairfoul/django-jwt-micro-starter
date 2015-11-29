var HttpService = function($http){
  this.request = function(request){

    request.headers = {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json;charset=utf-8',
    };

    return Rx.Observable.create(function(o){
			$http(request)
				.then(function(r){
					o.onNext(r.data);
					o.onCompleted();
				}, function(r){
          o.onError({data: r.data, status: r.status});
          o.onCompleted();
        });

			return Rx.Disposable.create(function(){});
		});
  };
  return this;
};

module.exports = HttpService;
