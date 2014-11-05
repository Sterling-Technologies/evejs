module.exports = function(error, request, response) {
	//setup an error response
	response.message = JSON.stringify({ 
		error: true, 
		message: error.message });
	
	//trigger that a response has been made
	this.trigger('user-response', request, response);
};