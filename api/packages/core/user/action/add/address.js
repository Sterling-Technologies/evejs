module.exports = (function() {
	//Index file called 
	var c = function(controller, request, response) {
        this.__construct.call(this, controller, request, response);
    }, public = c.prototype;

	/* Public Properties
    -------------------------------*/
    public.controller  = null;
    public.request   = null;
    public.response  = null;
         
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

	public.render = function() {
		sequence.then(function(next) { this.validate })
		.then(function(next) { this.setup });

		return this;
	}
	/* Public Methods
	-------------------------------*/
	//1. VALIDATE: if no id was set
	public.validate = function() {
		if(!request.variables[0]) {
			//setup an error response
			response.message = JSON.stringify({ 
				error: true, 
				message: 'No ID set' });
			
			//trigger that a response has been made
			controller.trigger('user-action-response', request, response);
			
			return;
		} 

		//if no query
		if(JSON.stringify(query) == '{}') {
			//setup an error response
			response.message = JSON.stringify({ 
				error: true, 
				message: 'No Parameters Defined' });
				
			//trigger that a response has been made
			controller.trigger('user-action-response', request, response);
			
			return;
		}

		controller
			//when there is an error
			.once('user-add-address-error', function(error) {
				//setup an error response
				response.message = JSON.stringify({ 
					error: true, 
					message: error.message });
				
				//trigger that a response has been made
				controller.trigger('user-action-response', request, response);
			})
			//when it is successfull
			.once('user-add-address-success', function() {
				//set up a success response
				response.message = JSON.stringify({ error: false });
				
				//trigger that a response has been made
				controller.trigger('user-action-response', request, response);
			})
			//Now call to remove the user
			.trigger(
				'user-add-address', 
				controller, 
				request.variables[0], 
				query);
	}
	/* Adaptor
	-------------------------------*/
	return c; 
})();