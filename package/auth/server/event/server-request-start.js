module.exports = function(request, response) {
	//if path does not starts with /auth
	if((request.path !== '/auth' 
	&& request.path.indexOf('/auth/') !== 0)
	|| response.processing) {
		//authorize the server?
		if(!this.config('settings').auth) {				
			//do nothing
			return;		
		}
		
		//no auth query attached?
		if(!request.query || !request.query.auth) {
			response.processing = 'auth';
			
			//setup an error response
			response.message = JSON.stringify({ 
				error: true, 
				message: 'You are not authorized to perform this action.' });
				
			//trigger that a response has been made
			this.trigger('auth-response', request, response);
			
			return;
		}
		
		//valid auth key?
		this.package('auth')
			.search()
			.addFilter('auth_id = ?', request.query.auth)
			.innerJoinOn('user', 'auth_user = user_id')
			.getRow(function(error, row) {
				if(row) {
					return;
				}

				response.processing = 'auth';
				
				//setup an error response
				response.message = JSON.stringify({ 
					error: true, 
					message: 'You are not authorized to perform this action.' });
					
				//trigger that a response has been made
				this.trigger('auth-response', request, response);
			}.bind(this));
		
		//do nothing
		return;
	}
	
	response.processing = 'auth';
	
	//trim the prefix
	var root 		= this.package('auth').path('action'),
		path 		= request.path.replace('/auth', ''),
		buffer 		= path.split('/'),
		action 		= root + '/login',
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