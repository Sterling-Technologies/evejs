module.exports = function(request, response) {
	//set up a success response
	response.message = JSON.stringify({ error: false });
	//trigger that a response has been made
	this.trigger('file-response', request, response);
};