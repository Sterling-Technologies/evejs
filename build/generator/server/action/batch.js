module.exports = (function() { 
    var Definition = function(controller, request, response) {
        this.__construct.call(this, controller, request, response);
    }, prototype = Definition.prototype;  
    
    /* Public Properties
    -------------------------------*/
    prototype.controller   = null;
    prototype.request      = null;
    prototype.response     = null;
    prototype.results      = [];

    /* Private Properties
    -------------------------------*/
    /* Loader
    -------------------------------*/
    prototype.__load = Definition.load = function(controller, request, response) {
        return new Definition(controller, request, response);
    };
    
    /* Construct
    -------------------------------*/
    prototype.__construct = function(controller, request, response) {
        //set request and other usefull data
        this.controller = controller;
        this.request    = request;
        this.response   = response;
		this.results	= [];
    };
     
    /* Public Methods
    -------------------------------*/
    prototype.render = function() {
        if(!this.request.message.length) {
			//setup an error response
			this.response.message = JSON.stringify({ 
				error: true, 
				message: 'No request data found.'});
			
			//trigger that a response has been made
			this.controller.trigger('{SLUG}-action-response', this.request, this.response);
			
			return this;
		}
		
		//set batch to true
        this.response.batch = true;
		
		//get the batch of requests
        var batch = JSON.parse(this.request.message);
		
		//NOTE: Should Sequence
		var sequence = this.controller.eden.load('sequence');
		
		//NOTE: Should sparse out request
		
        //Loop the all the batch request
        for(var request, action, i = 0; i < batch.length; i++) {
			//create default request object;
			request 			= Object.create(this.request);
			
			request.url 		= batch[i].url || '/{SLUG}';
			request.path 		= this.controller.eden.load('string').toPath(request.url);
			request.pathArray	= this.controller.eden.load('string').pathToArray(request.url);
			request.query 		= this.controller.eden.load('string').pathToQuery(request.url);
			request.message 	= batch[i].data || '';
			request.variables	= [];
			
			if(typeof request.message === 'object') {
				request.message = JSON.stringify(request.message);
			}
			
			//now call the actions based on the method
            switch(true) {
                case batch[i].url.toLowerCase().indexOf('/{SLUG}/create') === 0:  	
					action 	 			= require('./create');
					request.method 		= 'POST';
					break;
                case batch[i].url.toLowerCase().indexOf('/{SLUG}/remove/') === 0:
					action 	 			= require('./remove');
					request.method 		= 'DELETE';
					request.variables	= batch[i].url.replace('/{SLUG}/remove/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/{SLUG}/restore/') === 0:
					action 	 			= require('./restore');
					request.method 		= 'PUT';
					request.variables	= batch[i].url.replace('/{SLUG}/restore/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/{SLUG}/update/') === 0:
					action 	 			= require('./update');
					request.method 		= 'PUT';
					request.variables	= batch[i].url.replace('/{SLUG}/update/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/{SLUG}/detail/') === 0:
					action 	 			= require('./detail');
					request.method 		= 'GET';
					request.variables	= batch[i].url.replace('/{SLUG}/detail/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/{SLUG}/list') === 0:
					action 	 			= require('./list');
					request.method 		= 'GET';
					break;
				default:
					action 	 			= null;
					break;
            }
						
			//queue for sequence
			sequence.then(_virtual.call(this, action, request)); 
        }
		
		return this;
    };
     
    /* Private Methods
    -------------------------------*/
	var _virtual = function(virtualAction, virtualRequest) {
		var self = this;
		return function(next) {
			if(!virtualAction) {
				self.results.push({ error: true, message: 'No Action Found' });
				
				//If results is equal to request query
				if(self.results.length === JSON.parse(self.request.message).length) {
					//All batch results will be JSON stringify
					self.response.message = JSON.stringify({ batch: self.results });
		
					//Been trigger to the {SLUG} action
					self.controller.server.trigger('response', self.request, self.response);
				}
				
				next();
				return;
			}
			
			//listen for a {SLUG} action
			self.controller.once('{SLUG}-action-response', function(request, response) {
				//All results will be push to the array results
				this.results.push(JSON.parse(response.message));
				
				//If results is equal to request query
				if(this.results.length === JSON.parse(this.request.message).length) {
					//All batch results will be JSON stringify
					response.message = JSON.stringify({ batch: this.results });
		
					//Been trigger to the {SLUG} action
					this.controller.server.trigger('response', request, response);
				}
			
				next();
			}.bind(self));
			
			virtualAction.load(self.controller,virtualRequest, self.response).render();
		};
	};
	
    /* Adaptor
    -------------------------------*/
     return Definition;
})();