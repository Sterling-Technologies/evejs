module.exports = function() {
	//set a goto handler incase other packages
	//want to access this
	this.postuser = function() {
		return require('./factory').load(this);
	};
	
	//on init set the paths
	this.listen('init', function() {
		this.path('postuser', __dirname)
			.path('postuser/action', __dirname + '/action')
			.path('postuser/event', __dirname + '/event');
	
	}.bind(this))
	 
	//when the server starts listen to file events
	.listen('start', function() {
		//get event path
		var self = this, events = this.postuser().path('event');
		
		//get files in the event folder
		this.eden.load('folder', events).getFiles(null, false, function(files) {
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
				self.listen(files[i].getBase(), callback);
			}
		});
	}.bind(this))
	
	//when a server request has been made
	.listen('server-request', function(control, request, response) {
		//if path does not starts with /postuser
		if(request.path != '/postuser' && request.path.indexOf('/postuser/') !== 0) {
			//do nothing
			return;
		}
		
		response.processing = true;
		
		//trim the prefix
		var root 		= this.postuser().path('action'),
			path 		= request.path.replace('/postuser', ''),
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
		control.once('postuser-action-response', function(request, response) {
			//if it is a batch process
			if(response.batch) {
				//the batch will trigger the response
				return;
			}

			//trigger that a response has been made
			control.server.trigger('response', request, response);
		}); 
		
		//call it
		require(action).load(control, request, response).render();
	}.bind(this));
};