module.exports = function() {
	//set a goto handler incase other packages
	//want to access this
	this.sink = function() {
		return require('./factory').load(this);
	};
	 
	//on init set the paths
	this
		.on('init', function() {
			this.path('sink', __dirname)
				.path('sink/action', __dirname + '/action')
				.path('sink/event', __dirname + '/event')
				.path('sink/upload', this.path('upload') + '/core/sink');
		})
		 
		//when the server starts listen to file events
		.on('start', function() {
			//get event path
			var events = this.sink().path('event');
			
			//get files in the event folder
			this.Folder(events).getFiles(null, false, function(error, files) {
				//loop through files  
				for(var callback, i = 0; i < files.length; i++) {
					//accept only js
					if(files[i].getExtension() !== 'js') {
						continue;
					}
					
					//get callback
					callback = require(files[i].path);
					
					//only listen if it is a callback
					if(typeof callback !== 'function') {
						continue;
					}
					
					//now listen
					this.on(files[i].getBase(), callback);
				}
			}.bind(this));
		})
		
		//when a server request has been made
		.on('server-request-start', function(request, response) {
			//if path does not starts with /sink
			if(request.path !== '/sink' && request.path.indexOf('/sink/') !== 0) {
				//do nothing
				return;
			}
			
			response.processing = true;
			
			//trim the prefix
			var root 		= this.sink().path('action'),
				path 		= request.path.replace('/sink', ''),
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
			//listen for response
			this.once('sink-action-response', function(request, response) {
				//if it is a batch process
				if(response.batch) {
					//the batch will trigger the response
					return;
				}
				
				//trigger that a response has been made
				this.trigger('server-response', request, response);
			}); 
			
			//call it
			action = require(action).load(this, request, response);
			
			//call the request now, if it exists
			if(typeof action.request === 'function') {
				action.request();
			}
			
			//if there's a response method, call it when it's ready
			if(typeof action.response === 'function') {
				this.once('server-request-end', function() {
						action.response();				
				});
			}
		});
};