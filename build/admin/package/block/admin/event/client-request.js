define(function() {
	return function(e, request) {
		//if it doesn't start with user
		if(request.path.indexOf('/block') !== 0) {
			//we don't care about it
			return;
		}
		
		action = this.path('block/action') + '/index.js';
		
		//load up the action
		require([action + '.js'], function(action) {
			action().response(request);
		});
	};
});