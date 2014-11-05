module.exports = function(error, request, response) {
	if(typeof error === 'string') {
		error = { message: error, errors: [] };
	}
	
	//setup an error response
	response.message = JSON.stringify({ 
		error: true, 
		message: error.message,
		validation: error.errors || [] });
	
	//trigger that a response has been made
	this.trigger('user-response', request, response);
};