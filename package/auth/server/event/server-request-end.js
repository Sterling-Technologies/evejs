module.exports = function(request, response) {
	//if path does not starts with /post
	if(response.processing !== 'auth') {
		//do nothing
		return;
	}
	
	if(typeof response.action === 'object'
	&& typeof response.action.response === 'function') {
		response.action.response(request, response);
	}
};