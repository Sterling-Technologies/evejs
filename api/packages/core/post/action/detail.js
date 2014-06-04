module.exports = function(controller, request, response) {
	//if no id was set
	if(!request.variables[0]) {
		//setup an error response
		response.message = JSON.stringify({ 
			error: true, 
			message: 'No ID set' });
		
		//trigger that a response has been made
		controller.trigger('response', request, response);
		
		return;
	}
	
	controller.post().store()
	.findOne({ 
		_id: request.variables[0], 
		active: true })
	.lean()
	.exec(function(error, post) {
		//if there are errors
		if(error) {
			//setup an error response
			response.message = JSON.stringify({ 
				error: true, 
				message: error.message });
			
			//trigger that a response has been made
			controller.trigger('response', request, response);
			return;
		}
		
		//no error, then prepare the package
		response.message = JSON.stringify({ 
			error: false, 
			results: post });
		
		//trigger that a response has been made
		controller.trigger('response', request, response);
	});
};