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
		this.request  	= request;
		this.response  	= response;
	};

	/* Public Methods
    -------------------------------*/
	public.render = function() {
		//figure out the query and stuffs
		var query = this.request.query.query || {},
			range = this.request.query.range || 20,
			start = this.request.query.start || 0;

		var self  = this;
		//query for results
		self.controller
			.post()
			.store()
			.find(query)
			.where({ active: true })
			.skip(start)
			.limit(range)
			.lean()
			.exec(function(error, posts) {
				//if there are errors
				if(error) {
					//setup an error response
					self.response.message = JSON.stringify({ 
						error: true, 
						message: error.message });
					
					//trigger that a response has been made
					self.controller.server.trigger('response', self.request, self.response);
					return;
				}
				
				//no error, then prepare the package
				self.response.message = JSON.stringify({ error: false, results: posts });
				
				//trigger that a response has been made
				self.controller.server.trigger('response', self.request, self.response);
			});
	}
	
	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();