module.exports = function(controller, request, response) {
	var sequence = controller.eden.load('sequence');
	var c = function() {
		this.render.call();
	}, public = c.prototype;
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		if(!this.__instance) {
			this.__instance = new c();
		}
		return this.__instance;
	};
	/* Construct
	-------------------------------*/
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
	}
	//2. SETUP: 
	public.setup = function() {
		controller
			//when there is an error
			.once('user-restore-error', function(error) {
				//setup an error response
				response.message = JSON.stringify({ 
					error: true, 
					message: error.message });
				
				//trigger that a response has been made 
				controller.trigger('user-action-response', request, response);
			})
			//when it is successfull
			.once('user-restore-success', function() {
				//set up a success response
				response.message = JSON.stringify({ error: false });
				
				//trigger that a response has been made
				controller.trigger('user-action-response', request, response);
			})
			//Now call to remove the user
			.trigger('user-restore', controller, request.variables[0]);
	}
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c.load(); 
};