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
			this.Controller().trigger('{{name}}-response', request, response);
			
			return this;
		}
		
		//set batch to true
        response.batch = { request: request, results: [] };
		
		//get the batch of requests
        var batch = JSON.parse(request.message);
		
		//NOTE: We should sync
		var sync = this.sync();
		
		//NOTE: Should sparse out request
		
        //Loop the all the batch request
        for(var clone, action, i = 0; i < batch.length; i++) {
			//create default request object;
			clone 			= Object.create(request);
			
			clone.url 		= batch[i].url || '/{{name}}';
			clone.path 		= this.String().toPath(clone.url);
			clone.pathArray	= this.String().pathToArray(clone.url);
			clone.query 	= this.String().pathToQuery(clone.url);
			clone.message 	= batch[i].data || '';
			clone.variables	= [];
			
			if(typeof clone.message == 'object') {
				clone.message = this.Hash().toQuery(clone.message);
			}
			
			//now call the actions based on the method
            switch(true) {
                case batch[i].url.toLowerCase().indexOf('/{{name}}/{{to.schema.name}}') === 0:	
					action 	 		= require('./{{to.schema.name}}');
					clone.method 	= 'GET';
					clone.variables	= batch[i].url.replace('/{{name}}/{{to.schema.name}}/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/{{name}}/{{from.schema.name}}') === 0:	
					action 	 		= require('./{{from.schema.name}}');
					clone.method 	= 'GET';
					clone.variables	= batch[i].url.replace('/{{name}}/{{from.schema.name}}/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/{{name}}/create/') === 0:
					action 	 		= require('./create');
					clone.method 	= 'POST';
					clone.variables	= batch[i].url.replace('/{{name}}/create/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/{{name}}/remove/') === 0:
					action 	 		= require('./remove');
					clone.method 	= 'DELETE';
					clone.variables	= batch[i].url.replace('/{{name}}/remove/', '').split('/');
					break;
				default:
					action 	 		= null;
					break;
            }
				
			//queue for sequence
			sync.then(this._process.bind(this, action, clone, response)); 
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
			
			this.Controller().trigger('{{name}}-response', clone, response);
			return;
		}
		
		action.load().response(clone, response);
	};

	/* Private Methods
	-------------------------------*/
});