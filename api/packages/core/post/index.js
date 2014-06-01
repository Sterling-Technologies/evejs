module.exports = function() {
	//set a goto handler incase other packages
	//want to access this
	this.post = function() {
		return require('./factory').load(this);
	};
	
	//on init set the paths
	this.listen('init', this.eden.alter(function() {
		this.path('post', __dirname)
			.path('post/action', __dirname + '/action')
			.path('post/event', __dirname + '/event');
	
	}, this))
	
	//when the server starts listen to file events
	.listen('start', this.eden.alter(function() {
		//get event path
		var events = this.post().path('event');
		
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
		//if path does not starts with /post
		if(request.path != '/post' && request.path.indexOf('/post/') !== 0) {
			//do nothing
			return;
		}
		
		response.processing = true;
		
		//trim the prefix
		var root 		= this.post().path('action'),
			path 		= request.path.replace('/post', ''),
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
		
		//call it
		require(action).call(this, control, request, response);
	}, this));
};