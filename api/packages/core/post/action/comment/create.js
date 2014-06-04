module.exports = function(controller, request, response) {
	//1. SETUP
	//change the string into a native object
	var query = controller.eden
		.load('string', request.message)
		.queryToHash().get();
	
	//2. TRIGGER
	controller
		//when there is an error
		.once('comment-create-error', function(error) {
			//setup an error response
			response.message = JSON.stringify({ 
				error: true, 
				message: error.message });
			
			//trigger that a response has been made
			controller.server.trigger('response', request, response);
		})
		//when it is successfull
		.once('comment-create-success', function() {
			//set up a success response
			response.message = JSON.stringify({ error: false });
			
			//trigger that a response has been made
			controller.server.trigger('response', request, response);
		})
		//Now call to remove the comment
		.trigger('comment-create', controller, query);
};