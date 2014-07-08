module.exports = (function() { 
    var c = function(controller, request, response) {
        this.__construct.call(this, controller, request, response);
    }, public = c.prototype;  
    
    /* Public Properties
    -------------------------------*/
    public.controller   = null;
    public.request      = null;
    public.response     = null;
    public.results      = [];

    /* Private Properties
    -------------------------------*/
    /* Loader
    -------------------------------*/
    public.__load = c.load = function(controller, request, response) {
        return new c(controller, request, response);
    };
    
    /* Construct
    -------------------------------*/
    public.__construct = function(controller, request, response) {
        //set request and other usefull data
        this.controller = controller;
        this.request    = request;
        this.response   = response;
		this.results	= [];
    };
     
    /* Public Methods
    -------------------------------*/
    public.render = function() {
        if(!this.request.message.length) {
			//setup an error response
			this.response.message = JSON.stringify({ 
				error: true, 
				message: 'No request data found.'});
			
			//trigger that a response has been made
			this.controller.trigger('categorypost-action-response', this.request, this.response);
			
			return this;
		}
		
		//set batch to true
        this.response.batch = true;
		
		//get the batch of requests
        var batch = JSON.parse(this.request.message);
		
		//NOTE: Should Sequence
		var self = this, sequence = this.controller.eden.load('sequence');
		
		//NOTE: Should sparse out request
		
        //Loop the all the batch request
        for(var request, action, i = 0; i < batch.length; i++) {
			//create default request object;
			request 			= Object.create(this.request);
			
			request.url 		= batch[i].url || '/categorypost';
			request.path 		= this.controller.eden.load('string').toPath(request.url);
			request.pathArray	= this.controller.eden.load('string').pathToArray(request.url);
			request.query 		= this.controller.eden.load('string').pathToQuery(request.url);
			request.message 	= batch[i].data || '';
			request.variables	= [];
			
			if(typeof request.message == 'object') {
				request.message = JSON.stringify(request.message);
			}
			
			//now call the actions based on the method
            switch(true) {
                case batch[i].url.toLowerCase().indexOf('/categorypost/create') === 0:  	
					action 	 			= require('./create');
					request.method 		= 'POST';
					break;
                case batch[i].url.toLowerCase().indexOf('/categorypost/remove/') === 0:
					action 	 			= require('./remove');
					request.method 		= 'DELETE';
					request.variables	= batch[i].url.replace('/categorypost/remove/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/categorypost/restore/') === 0:
					action 	 			= require('./restore');
					request.method 		= 'PUT';
					request.variables	= batch[i].url.replace('/categorypost/restore/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/categorypost/update/') === 0:
					action 	 			= require('./update');
					request.method 		= 'PUT';
					request.variables	= batch[i].url.replace('/categorypost/update/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/categorypost/detail/') === 0:
					action 	 			= require('./detail');
					request.method 		= 'GET';
					request.variables	= batch[i].url.replace('/categorypost/detail/', '').split('/');
					break;
                case batch[i].url.toLowerCase().indexOf('/categorypost/list') === 0:
					action 	 			= require('./list');
					request.method 		= 'GET';
					break;
				default:
					action 	 			= null;
					break;
            }
						
			//queue for sequence
			sequence.then((function(virtualAction, virtualRequest) {
				return function(next) {
					if(!virtualAction) {
						self.results.push({ error: true, message: 'No Action Found' });
						
						//If results is equal to request query
						if(self.results.length == JSON.parse(self.request.message).length) {
							//All batch results will be JSON stringify
							self.response.message = JSON.stringify({ batch: self.results });
				
							//Been trigger to the categorypost action
							self.controller.server.trigger('response', self.request, self.response);
						}
						
						next();
						return;
					}
					
					//listen for a categorypost action
        			self.controller.once('categorypost-action-response', function(request, response) {
						//All results will be push to the array results
						this.results.push(JSON.parse(response.message));
						
						//If results is equal to request query
						if(this.results.length == JSON.parse(this.request.message).length) {
							//All batch results will be JSON stringify
							response.message = JSON.stringify({ batch: this.results });
				
							//Been trigger to the categorypost action
							this.controller.server.trigger('response', request, response);
						}
					
						next();
					}.bind(self));
					
					virtualAction.load(self.controller,virtualRequest, self.response).render();
				};
			})(action, request)); 
        }
		
		return this;
    };
     
    /* Private Methods
    -------------------------------*/
    /* Adaptor
    -------------------------------*/
     return c;
})();