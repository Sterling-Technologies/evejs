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
		var rest = this.request, resp = this.response;
		if(!rest.variables[0]) {
			//setup an error response
			resp.message = JSON.stringify({ 
				error: true, 
				message: 'No ID set' });
			
			//trigger that a response has been made
			this.controller.trigger('user-action-response', this.request, this.response);
			
			return;
		}

		this.controller.user().store()
			.findOne({ 
				_id: rest.variables[0], 
				active: true })
			.lean()
			.exec(function(error, user) {
				//if there are errors
				if(error) {
					//setup an error response
					resp.message = JSON.stringify({ 
						error: true, 
						message: error.message });
					
					//trigger that a response has been made
					this.controller.trigger('user-action-response', this.request, this.response);

					return;
				}
				
				//no error, then prepare the package
				resp.message = JSON.stringify({ 
					error: false, 
					results: user });
				
				//trigger that a response has been made
				this.controller.trigger('user-action-response', this.request, this.response);
			});
	}
	/* Adaptor
	-------------------------------*/
	return c; 
})();