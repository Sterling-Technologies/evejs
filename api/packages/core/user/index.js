module.exports = function() {
	//set a goto handler incase other packages
	//want to access this
	this.user = function() {
		return require('./factory').load(this);
	};
	
	//on init set the paths
	this.listen('init', this.eden.alter(function() {
		this.path('user', __dirname)
			.path('user/action', __dirname + '/action')
			.path('user/event', __dirname + '/event');
	
	}, this))
	
	//when the server starts listen to file events
	.listen('start', this.eden.alter(function() {
		//get event path
		var events = this.user().path('event');
		
		//get files in the event folder
		var files = this.eden.load('file', events).getFiles();
		
		//loop through files
		for(var callback, i = 0; i < files.length; i++) {
			//accept only js
			if(files[i].getExtension() != 'js') {
				continue;
			}
			
			//get callback
			callback = require(files[i].path);
			
			//only listen if it is a callback
			if(typeof callback != 'function') {
				continue;
			}
			
			//now listen
			this.listen(files[i].getBase(), callback);
		}
	}, this))
	
	//when a server request has been made
	.listen('server-request', this.eden.alter(function(control, request, response) {
		//if path does not starts with /user
		if(request.path != '/user' && request.path.indexOf('/user/') !== 0) {
			//do nothing
			return;
		}
		
		response.processing = true;
		
		//trim the prefix
		var root 		= this.user().path('action'),
			path 		= request.path.replace('/user', ''),
			buffer 		= path.split('/'),
			action 		= root + '/index',
			variables 	= [];
		
		//traverse backwards to determine the correct action
		while(buffer.length > 1) {
			//if this is an actual file
			if(this.eden.load('file', root + buffer.join('/') + '.js').isFile()) {
				//this is the action we want
				action = root + buffer.join('/');
				break;
			}
			
			variables.unshift(buffer.pop());
		}
		
		//set the variables
		request.variables = variables;

		//listen for response
		controller.listen('user-action-response', function(request, response) {
			//if it is a batch process
			if(response.batch) {
				//the batch will trigger the response
				return;
			}

			//trigger that a response has been made
			controller.server.trigger('response', request, response);
		});
		
		//call it
		require(action).call(this, control, request, response);
	}, this));
};