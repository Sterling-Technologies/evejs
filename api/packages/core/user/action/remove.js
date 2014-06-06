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
		var rest = this.request, resp = this.response;
		if(!rest.variables[0]) {
			//setup an error response
			resp.message = JSON.stringify({ 
				error: true, 
				message: 'No ID set' });
			
			//trigger that a response has been made
			this.controller.trigger('user-action-response', this.request, this.response);

			return this;
		}

		this.controller
			//when there is an error
			.once('user-remove-error', function(error) {
				//setup an error response
				resp.message = JSON.stringify({ 
					error: true, 
					message: error.message });
				
				//trigger that a response has been made 
				this.controller.trigger('user-action-response', this.request, this.response);
			})
			//when it is successfull
			.once('user-remove-success', function() {
				//set up a success response
				resp.message = JSON.stringify({ error: false });
				
				//trigger that a response has been made
				this.controller.trigger('user-action-response', this.request, this.response);
			})
			//Now call to remove the user
			.trigger('user-remove', this.controller, resp.variables[0]);
	}
	
	/* Adaptor
	-------------------------------*/
	return c; 
})();