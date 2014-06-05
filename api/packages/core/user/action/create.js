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
		//1. SETUP: change the string into a native object
		var query = this.controller.eden
			.load('string', this.request.message)
			.queryToHash().get();
			
		//2. TRIGGER
		var self = this;
		this.controller
			//when there is an error 
			.once('user-create-error', function(error) {
				//setup an error response
				self.response.message = JSON.stringify({ 
					error: true, 
					message: error.message });
				
				//trigger that a response has been made
				self.controller.trigger('user-action-response', self.request, self.response);
			})
			//when it is successfull
			.once('user-create-success', function() {
				//set up a success response
				self.response.message = JSON.stringify({ error: false });
				
				//trigger that a response has been made
				self.controller.trigger('user-action-response', self.request, self.response);
			})
			//Now call to remove the user
			.trigger('user-create', this.controller, query);
	};
	
	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();