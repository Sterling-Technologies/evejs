module.exports = function(controller, request, response) {
	//1. VALIDATE
	//if no id was set
	if(!request.variables[0]) {
		//setup an error response
		response.message = JSON.stringify({ 
			error: true, 
			message: 'No ID set' });
		
		//trigger that a response has been made
		controller.trigger('user-action-response', request, response);
		
		return;
	} 
	//2. SETUP
	//change the string into a native object
	var query = controller.eden
		.load('string', request.message)
		.queryToHash().get();
	
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
	
	//3. TRIGGER
	controller
		//when there is an error
		.once('user-add-phone-error', function(error) {
			//setup an error response
			response.message = JSON.stringify({ 
				error: true, 
				message: error.message });
			
			//trigger that a response has been made
			controller.trigger('user-action-response', request, response);
		})
		//when it is successfull
		.once('user-add-phone-success', function() {
			//set up a success response
			response.message = JSON.stringify({ error: false });
			
			//trigger that a response has been made
			controller.trigger('user-action-response', request, response);
		})
		//Now call to remove the user
		.trigger(
			'user-add-phone', 
			controller, 
			request.variables[0], 
			query);
};