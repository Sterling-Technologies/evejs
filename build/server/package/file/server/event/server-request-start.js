module.exports = function(request, response) {
	//if path does not starts with /file
	if(request.path !== '/file' 
	&& request.path.indexOf('/file/') !== 0) {
		//do nothing
		return;
	}
	
	response.processing = true;
	
	//trim the prefix
	var root 		= this.package('file').path('action'),
		path 		= request.path.replace('/file', ''),
		buffer 		= path.split('/'),
		action 		= root + '/index',
		variables 	= [];
	
	//traverse backwards to determine the correct action
	while(buffer.length > 1) {
		//if this is an actual file
		if(this.File(root + buffer.join('/') + '.js').isFile()) {
			//this is the action we want
			action = root + buffer.join('/');
			break;
		}
		
		variables.unshift(buffer.pop());
	}
	
	//set the variables
	request.variables = variables;
	
	//call it, store it in response
	response.action = require(action).load();
	
	//call the request now, if it exists
	if(typeof response.action.request === 'function') {
		response.action.request(request, response);
	}
};