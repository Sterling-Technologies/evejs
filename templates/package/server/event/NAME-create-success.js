module.exports = function(id, request, response) {
	//set up a success response
	response.message = JSON.stringify({ error: false, results: id });
	//trigger that a response has been made
	this.trigger('{{name}}-response', request, response);
};