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
	
	//if no query
	if(JSON.stringify(query) == '{}') {
		//setup an error response
		response.message = JSON.stringify({ 
			error: true, 
			message: 'No Parameters Defined' });
			
		//trigger that a response has been made
		controller.server.trigger('response', request, response);
		
		return;
	}
	
	//3. TRIGGER
	controller
		//when there is an error
		.once('user-add-address-error', function(error) {
			//setup an error response
			response.message = JSON.stringify({ 
				error: true, 
				message: error.message });
			
			//trigger that a response has been made
			controller.server.trigger('response', request, response);
		})
		//when it is successfull
		.once('user-add-address-success', function() {
			//set up a success response
			response.message = JSON.stringify({ error: false });
			
			//trigger that a response has been made
			controller.server.trigger('response', request, response);
		})
		//Now call to remove the user
		.trigger(
			'user-add-address', 
			controller, 
			request.variables[0], 
			query);
};