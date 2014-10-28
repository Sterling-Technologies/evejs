module.exports = require('edenjs').extend(function() {
	/* Require
	-------------------------------*/
	/* Constants
	-------------------------------*/
	/* Public Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	/* Public Methods
	-------------------------------*/
	this.response = function(request, response) {
		if(!request.message.length) {
			//setup an error response
			response.message = JSON.stringify({ 
				error: true, 
				message: 'No request data found.'});
			
			//trigger that a response has been made
			this.Controller().trigger('batch-response', request, response);
			
			return this;
		}
		
		//set batch to true
        response.batch = { request: request, results: [] };
		
		//get the batch of requests
        var batch = JSON.parse(request.message);
		
		//NOTE: We should sync
		var sync = this.sync();
		
		//NOTE: Should sparse out request
		var clone, action, root, path, buffer, variables;
		
        //Loop the all the batch request
        for(var i = 0; i < batch.length; i++) {
			//create default request object;
			clone 			= Object.create(request);
			
			clone.url 		= batch[i].url;
			clone.path 		= this.String().toPath(clone.url);
			clone.pathArray	= this.String().pathToArray(clone.url);
			clone.query 	= this.String().pathToQuery(clone.url);
			clone.message 	= batch[i].data || '';
			clone.method	= batch[i].method || 'GET'
			clone.variables	= [];
			
			if(typeof clone.message === 'object') {
				clone.message = this.Hash().toQuery(clone.message);
			}
			
			if(!this.Controller().package(clone.pathArray[0])) {
				//queue for sequence
				sync.then(this._process.bind(this, null, clone, response));
				continue;
			}
			
			root 		= this.Controller().package(clone.pathArray[0]).path('action'),
			path 		= clone.path.replace('/' + clone.pathArray[0], ''),
			buffer 		= path.split('/'),
			action 		= null,
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
			clone.variables = variables;
			
			if(action === null) {
				//queue for sequence
				sync.then(this._process.bind(this, null, clone, response));
				continue;
			}
			
			//queue for sequence
			sync.then(this._process.bind(this, require(action), clone, response));
        }
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	this._process = function(action, clone, response, next) {
		response.batch.next = next;
		
		if(!action) {
			response.message = JSON.stringify({ 
				error: true, 
				message: 'No Action Found' });
			
			this.Controller().trigger('batch-response', clone, response);
			return;
		}
		
		action.load().response(clone, response);
	};

	/* Private Methods
	-------------------------------*/
});