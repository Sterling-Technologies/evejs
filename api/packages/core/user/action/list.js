module.exports = function(controller, request, response) {
	var query = request.query.query || {},
		range = request.query.range || 20,
		start = request.query.start || 0;
	
	//query for results
	controller.user().store()
	.find(query)
	.where({ active: true })
	.skip(start).limit(range)
	.lean()
	.exec(function(error, users) {
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
		response.message = JSON.stringify({ error: false, results: users });
		
		//trigger that a response has been made
		controller.server.trigger('response', request, response);
	});
};