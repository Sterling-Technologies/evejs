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
	this.request = function(request, response) {
		var action = null;
		
		//if there is an id
		if(request.variables[0]) {
			//and a put is made
			if(request.method.toUpperCase() == 'PUT') {
				//it must be an update
				action = require('./update');
			//is it a delete ?
			} else if(request.method.toUpperCase() == 'DELETE') {
				//it must be an removal
				action = require('./remove');
			} else {
				//it must be a detail
				action = require('./detail');
			}
		//is there a post ?
		} else if(request.method.toUpperCase() == 'POST') {
			//it must be a create
			action = require('./create');
		//by default 
		} else {
			//it must be a listing
			action = require('./list');
		}

		response.action = action.load();
		
		//call the request now, if it exists
		if(typeof response.action.request === 'function') {
			response.action.request(request, response);
		}
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).singleton();