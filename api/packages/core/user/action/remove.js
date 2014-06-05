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
	//2. TRIGGER
	controller
		//when there is an error
		.once('user-remove-error', function(error) {
			//setup an error response
			response.message = JSON.stringify({ 
				error: true, 
				message: error.message });
			
			//trigger that a response has been made 
			controller.trigger('user-action-response', request, response);
		})
		//when it is successfull
		.once('user-remove-success', function() {
			//set up a success response
			response.message = JSON.stringify({ error: false });
			
			//trigger that a response has been made
			controller.trigger('user-action-response', request, response);
		})
		//Now call to remove the user
		.trigger('user-remove', controller, request.variables[0]);
};