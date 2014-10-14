module.exports = require('edenjs').extend(function() {
	/* Require
	-------------------------------*/
	/* Constants
	-------------------------------*/
	/* Public Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._controller  	= null;
    this._request   	= null;
    this._response  	= null;
	this._results		= [];
	
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	this.___construct = function(controller, request, response) {
		this._controller  	= controller;
		this._request   	= request;
		this._response  	= response;
	};
	
	/* Public Methods
	-------------------------------*/
	this.response = function() {
		if(!this._request.message.length) {
			//setup an error response
			this._response.message = JSON.stringify({ 
				error: true, 
				message: 'No request data found.'});
			
			//trigger that a response has been made
			this._controller.trigger('sink-action-response', this._request, this._response);
			
			return this;
		}
		
		//set batch to true
        this._response.batch = true;
		
		//get the batch of requests
        var batch = JSON.parse(this._request.message);
		
		//NOTE: We should sync
		var sync = this.sync();
		
		//NOTE: Should sparse out request
		
        //Loop the all the batch request
        for(var request, action, i = 0; i < batch.length; i++) {
			//create default request object;
			request 			= Object.create(this._request);
			
			request.url 		= batch[i].url || '/sink';
			request.path 		= this.String().toPath(request.url);
			request.pathArray	= this.String().pathToArray(request.url);
			request.query 		= this.String().pathToQuery(request.url);
			request.message 	= batch[i].data || '';
			request.variables	= [];
			
			if(typeof request.message == 'object') {
				request.message = this.Hash().toQuery(request.message);
			}
			
			//now call the actions based on the method
            switch(true) {
                case batch[i].url.toLowerCase().indexOf('/sink/create') === 0:  	
					action 	 			= require('./create');
					request.method 		= 'POST';
					break;
                case batch[i].url.toLowerCase().indexOf('/sink/remove/') === 0:
					action 	 			= require('./remove');
					request.method 		= 'DELETE';
					request.variables	= batch[i].url.replace('/sink/remove/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/sink/restore/') === 0:
					action 	 			= require('./restore');
					request.method 		= 'PUT';
					request.variables	= batch[i].url.replace('/sink/restore/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/sink/update/') === 0:
					action 	 			= require('./update');
					request.method 		= 'PUT';
					request.variables	= batch[i].url.replace('/sink/update/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/sink/detail/') === 0:
					action 	 			= require('./detail');
					request.method 		= 'GET';
					request.variables	= batch[i].url.replace('/sink/detail/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/sink/list') === 0:
					action 	 			= require('./list');
					request.method 		= 'GET';
					break;
				default:
					action 	 			= null;
					break;
            }
				
			//queue for sequence
			sync.then(function(action, request, next) {
				if(!action) {
					this._results.push({ error: true, message: 'No Action Found' });
					
					//If results is equal to request query
					if(this._results.length == JSON.parse(this._request.message).length) {
						//All batch results will be JSON stringify
						this._response.message = JSON.stringify({ batch: this._results });
			
						//Trigger to the server response
						this._controller.trigger('server-response', request, this._response);
					}
					
					next();
					return;
				}
				
				//listen for a post action
				this._controller.once('sink-action-response', function(request, response) {
					//All results will be push to the array results
					this._results.push(JSON.parse(response.message));
					
					//If results is equal to request query
					if(this._results.length == JSON.parse(this._request.message).length) {
						//All batch results will be JSON stringify
						response.message = JSON.stringify({ batch: this._results });
			
						//Been trigger to the post action
						this._controller.trigger('server-response', request, response);
					}
				
					next();
				}.bind(this));
				
				action.load(this._controller, request, this._response).response();
			}.bind(this, action, request)); 
        }
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
});