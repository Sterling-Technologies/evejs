module.exports = function(request, response) {
	//if path does not starts with /file
	if(request.path !== '/file' 
	&& request.path.indexOf('/file/') !== 0) {
		//do nothing
		return;
	}
	
	if(typeof response.action === 'object'
	&& typeof response.action.response === 'function') {
		response.action.response(request, response);
	}
};