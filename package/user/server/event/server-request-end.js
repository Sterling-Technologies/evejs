module.exports = function(request, response) {
	//if path does not starts with /user
	if(response.processing !== 'user') {
		//do nothing
		return;
	}
	
	if(typeof response.action === 'object'
	&& typeof response.action.response === 'function') {
		response.action.response(request, response);
	}
};