module.exports = require('edenjs').extend(function() {
	/* Require
	-------------------------------*/
	/* Constants
	-------------------------------*/
	/* Public Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	/* Public Methods
	-------------------------------*/
	this.response = function(request, response) {
		//if there are errors
		if(!request.variables[0] 
		|| !request.variables[1] 
		|| !parseInt(request.variables[0]) 
		|| !parseInt(request.variables[1])) {
			//trigger an error
			this.Controller().trigger('{{name}}-create-error', { 
				message: 'Data sent to server is invalid'
			}, request, response);
			
			return;
		}
		
		var clearFrom = !!request.variables[2];
		var clearTo = !!request.variables[3];
		
		this.Controller().trigger('{{name}}-create', 
			parseInt(request.variables[0]), 
			parseInt(request.variables[1]), 
			clearFrom, clearTo, request, response);
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).singleton();