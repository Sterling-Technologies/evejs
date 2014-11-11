module.exports = function(request, response) {
	//if path does not starts with /{{name}}
	if(response.processing !== '{{name}}') {
		//do nothing
		return;
	}
	
	if(typeof response.action === 'object'
	&& typeof response.action.response === 'function') {
		response.action.response(request, response);
	}
};