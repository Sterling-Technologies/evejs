module.exports = function(row, request, response) {
	//set up a success response
	response.message = JSON.stringify({ error: false, results: row });
	//trigger that a response has been made
	this.trigger('auth-response', request, response);
};