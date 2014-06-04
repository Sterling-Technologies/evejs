module.exports = function(controller, request, response) {
	//1. VALIDATE
	//if no id was set
	if(!request.variables[0]) {
		//setup an error response
		response.message = JSON.stringify({ 
			error: true, 
			message: 'No ID set' });
		
		//trigger that a response has been made
		controller.server.trigger('response', request, response);
		
		return;
	}
	
	//2. SETUP
	//change the string into a native object
	var query = controller.eden
		.load('string', request.message)
		.queryToHash().get();
	
	//3. TRIGGER
	controller
		//when there is an error
		.once('comment-update-error', function(error) {
			//setup an error response
			response.message = JSON.stringify({ 
				error: true, 
				message: error.message });
			
			//trigger that a response has been made
			controller.server.trigger('response', request, response);
		})
		//when it is successfull
		.once('comment-update-success', function() {
			//set up a success response
			response.message = JSON.stringify({ error: false });
			
			//trigger that a response has been made
			controller.server.trigger('response', request, response);
		})
		//Now call to update the comment
		.trigger(
			'comment-update', 
			controller, 
			request.variables[0], 
			query);
};