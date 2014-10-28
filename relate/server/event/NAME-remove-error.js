module.exports = function(error, request, response) {
	if(typeof error === 'string') {
		error = { message: error, errors: [] };
	}
	
	//setup an error response
	response.message = JSON.stringify({ 
		error: true, 
		message: error.message,
		validation: [] });
	
	//trigger that a response has been made
	this.trigger('{{name}}-response', request, response);
};