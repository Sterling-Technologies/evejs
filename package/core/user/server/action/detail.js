module.exports = function(controller, request, response) {
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
			controller.server.trigger('response', request, response);
			return;
		}
		
		//no error, then prepare the package
		response.message = JSON.stringify({ 
			error: false, 
			results: user });
		
		//trigger that a response has been made
		controller.server.trigger('response', request, response);
	});
};