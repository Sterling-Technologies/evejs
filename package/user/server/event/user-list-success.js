module.exports = function(data, request, response) {
	//then prepare the package
	response.message = JSON.stringify({ 
		error: false, 
		results: data });
	
	//trigger that a response has been made
	this.trigger('user-response', request, response);
};