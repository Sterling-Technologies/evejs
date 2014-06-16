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
		//if no ID
		if(!this.request.variables[0]) {
			//setup an error response
			this.response.message = JSON.stringify({ 
				error: true, 
				message: 'No ID set' });
			
			//trigger that a response has been made
			this.controller.trigger('user-action-response', this.request, this.response);
			
			return;
		}
		
		var self = this;
		
		this.controller.user().store()
			.findOne({ _id: this.request.variables[0], active: true })
			.lean().exec(function(error, user) {
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
					results: user });
				
				//trigger that a response has been made
				self.controller.trigger('user-action-response', self.request, self.response);
			});

		return this;
	};
	
	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();