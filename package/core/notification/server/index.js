module.exports = function() {
	//set a goto handler incase other packages
	//want to access this
	this.notification = function() {
		return require('./factory').load(this);
	};

	//on init set the paths
	this.listen('init', function() {
		this.path('notification', 			__dirname)
			.path('notification/action', 	__dirname + '/action')
			.path('notification/event', 	__dirname + '/event')
			.path('notification/stream', 	__dirname + '/stream');
	}.bind(this))
	 
	//when the server starts listen to notification events
	.listen('start', function() {
		//get event path
		var self = this, events = this.notification().path('event');
		
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
		//if path does not starts with /notification
		if(request.path != '/notification' && request.path.indexOf('/notification/') !== 0) {
			//do nothing
			return;
		}
		
		response.processing = true;
		
		//trim the prefix
		var root 		= this.notification().path('action'),
			path 		= request.path.replace('/notification', ''),
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
		control.once('notify-action-response', function(request, response) {
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
	}.bind(this))

	// when a socket client is connected
	.listen('socket-request', function(control, socket) {
		// get socket namespaces
		var namespace = socket.nsps;

		for(var i in namespace) {
			// if namespace is not notification
			if(i != '/notification' && i.indexOf('/notification/') === -1) {
				// just do nothing
				continue;
			}

			var root 	  = this.notification().path('stream'),
				path 	  = i.replace('/notification', ''),
				buffer 	  = path.split('/'),
				action    = root + '/index',
				variables = [];

			// traverse backwards to determine the correct action
			while(buffer.length > 1) {
				// if this is an actual file
				if(this.eden.load('file', root + buffer.join('/') + '.js').isFile()) {
					// this is the action we want
					action = root + buffer.join('/');
					break;
				}

				variables.unshift(buffer.pop());
			}

			// add variables to socket object
			socket.variables = variables;

			// we need to wrap this in a closure
			// cause we are listening to asynchronous
			// socket on connection.
			(function(i, socket, action) {
				// create a channel for
				// current request
				var channel = socket
					.of(i)
					.removeAllListeners('connection')
					.on('connection', function(socket) {
						// call socket action
						require(action).load(control, channel, socket).render();
					});
			})(i, socket, action);
		}

	}.bind(this));
};