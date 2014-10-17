module.exports = function(request, response) {
	//if path does not starts with /{{name}}
	if(request.path !== '/{{name}}' && request.path.indexOf('/{{name}}/') !== 0) {
		//do nothing
		return;
	}
	
	if(typeof response.action === 'object'
	&& typeof response.action.response === 'function') {
		response.action.response(request, response);
	}
};