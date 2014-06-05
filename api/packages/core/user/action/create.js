module.exports = function(controller, request, response) {
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
		console.log("create.js render");
		//1. SETUP: change the string into a native object
		var query = controller.eden
			.load('string', request.message)
			.queryToHash().get();
		//2. TRIGGER
		controller
			//when there is an error 
			.once('user-create-error', function(error) {
				//setup an error response
				response.message = JSON.stringify({ 
					error: true, 
					message: error.message });
				
				//trigger that a response has been made
				controller.trigger('user-action-response', request, response);
			})
			//when it is successfull
			.once('user-create-success', function() {
				//set up a success response
				response.message = JSON.stringify({ error: false });
				
				//trigger that a response has been made
				controller.trigger('user-action-response', request, response);
			})
			//Now call to remove the user
			.trigger('user-create', controller, query);
	}
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c.load(); 
};