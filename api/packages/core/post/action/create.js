module.exports = function(controller, request, response) {
	//1. SETUP
	//change the string into a native object
	var query = controller.eden
		.load('string', request.message)
		.queryToHash().get();
	
	//2. TRIGGER
	controller
		//when there is an error
		.once('post-create-error', function(error) {
			//setup an error response
			response.message = JSON.stringify({ 
				error: true, 
				message: error.message });
			
			//trigger that a response has been made
			controller.trigger('response', request, response);
		})
		//when it is successfull
		.once('post-create-success', function() {
			//set up a success response
			response.message = JSON.stringify({ error: false });
			
			//trigger that a response has been made
			controller.trigger('response', request, response);
		})
		//Now call to remove the post
		.trigger('post-create', controller, query);
};