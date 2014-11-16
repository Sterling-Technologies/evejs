define(function() {
	return function(e, request) {
		//if path does not starts with /file
		if(request.path !== '/file' && request.path.indexOf('/file/') !== 0) {
			//do nothing
			return;
		}
		
		//trim the prefix
		var root 		= this.package('file').path('action'),
			path 		= request.path.replace('/file', ''),
			buffer 		= path.split('/'),
			action 		= root + '/index',
			variables 	= [];
		
		//traverse backwards to determine the correct action
		while(buffer.length > 1) {
			//if this is an actual file
			if(this.File(root + buffer.join('/') + '.js').isFile()) {
				//this is the action we want
				action = root + buffer.join('/');
				break;
			}
			
			variables.unshift(buffer.pop());
		}
		
		//set the variables
		request.variables = variables;
		
		//call it, store it in response
		require([action + '.js'], function(callback) {
			var action = callback();
			
			//event when the file request is starting
			this.trigger('file-request-start', request, action);
			
			//call the request now, if it exists
			if(typeof action.response === 'function') {
				action.response(request);
			}
			
			//event when the file request is starting
			this.trigger('file-request-end', request, action);
		}.bind(this));
	};
});