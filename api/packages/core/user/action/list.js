module.exports = (function() { 
	var c = function(controller, request, response) {
        this.__construct.call(this, controller, request, response);
    }, public = c.prototype;

	/* Public Properties
    -------------------------------*/
    public.controller  	= null;
    public.request   	= null;
    public.response  	= null;
    
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
		this.request  = request;
		this.response  = response;
	};

	/* Public Methods
    -------------------------------*/
	public.render = function() {
		//figure out the query and stuffs
		var query 	= this.request.query.filter || {},
			range 	= this.request.query.range || 50,
			start 	= this.request.query.start || 0,
			order 	= this.request.query.order || {},
			count	= this.request.query.count || 0;
		
		//fix query
		query.active = query.active != 0;
		
		//if null value, just test if it exists
		for(var key in query) {
			if(query[key] !== null) {
				continue;
			}
			
			query[key] = { $exists: true };
		}
		
		//remember the scope and load up the data store
		var self = this, store = this.controller.user().store();
		
		//if we just want the count based from the query
		if(count) {
			//execute the count query
			store.count(query, function(error, data) {
				//if there are errors
				if(error) {
					//setup an error response
					self.response.message = JSON.stringify({ 
						error: true, 
						message: error.message });
					
					//trigger that a response has been made
					self.controller.trigger('user-action-response', self.request, self.response);
					return;
				}
				
				//no error, then prepare the package
				self.response.message = JSON.stringify({ 
					error: false, 
					results: data });
				
				//trigger that a response has been made
				self.controller.trigger('user-action-response', self.request, self.response);
			});
			
			return;
		} 
		
		//set up the store for results
		store = store
			.find(query)
			.skip(start)
			.limit(range);
		
		for(key in order) {
			store.sort(key, order[key] != -1 ? 1: -1);
		}
		
		//query for results
		store.lean().exec(function(error, data) {
			//if there are errors
			if(error) {
				//setup an error response
				self.response.message = JSON.stringify({ 
					error: true, 
					message: error.message });
				
				//trigger that a response has been made
				self.controller.trigger('user-action-response', self.request, self.response);
				return;
			}
			
			//no error, then prepare the package
			self.response.message = JSON.stringify({ 
				error: false, 
				results: data });
			
			//trigger that a response has been made
			self.controller.trigger('user-action-response', self.request, self.response);
		});
	};
	
	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();