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
		if(!request.variables[0]) {
			//setup an error response
			response.message = JSON.stringify({ 
				error: true, 
				message: 'No ID set' });
			
			//trigger that a response has been made
			controller.trigger('user-action-response', request, response);

			return;
		}

		var query = controller.eden
			.load('string', request.message)
			.queryToHash().get();
		
		//3. TRIGGER
		controller
			//when there is an error
			.once('user-update-error', function(error) {
				//setup an error response
				response.message = JSON.stringify({ 
					error: true, 
					message: error.message });
				
				//trigger that a response has been made
				controller.trigger('user-action-response', request, response);
			})
			//when it is successfull
			.once('user-update-success', function() {
				//set up a success response
				response.message = JSON.stringify({ error: false });
				 
				//trigger that a response has been made
				controller.trigger('user-action-response', request, response);
			})
			//Now call to update the user
			.trigger(
				'user-update', 
				controller, 
				request.variables[0], 
				query);
	}
	/* Adaptor
	-------------------------------*/
	return c; 
})();