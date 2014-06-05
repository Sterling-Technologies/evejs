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
	//2. SETUP: change the string into a native object
	public.setup = function() {
		controller.user().store()
		.findOne({ 
			_id: request.variables[0], 
			active: true })
		.lean()
		.exec(function(error, user) {
			//if there are errors
			if(error) {
				//setup an error response
				response.message = JSON.stringify({ 
					error: true, 
					message: error.message });
				
				//trigger that a response has been made
				controller.trigger('user-action-response', request, response);

				return;
			}
			
			//no error, then prepare the package
			response.message = JSON.stringify({ 
				error: false, 
				results: user });
			
			//trigger that a response has been made
			controller.trigger('user-action-response', request, response);
		});
	}
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c.load(); 
};