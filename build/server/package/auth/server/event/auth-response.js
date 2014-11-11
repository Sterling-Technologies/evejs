module.exports = function(request, response) {
	//trigger that a response has been made
	this.trigger('server-response', request, response);
};