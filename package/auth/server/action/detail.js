module.exports = require('edenjs').extend(function() {
	/* Require
	-------------------------------*/
	/* Constants
	-------------------------------*/
	/* Public Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._controller = null;
	
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	this.___construct = function(controller) {
		this._controller = controller;
	};
	
	/* Public Methods
	-------------------------------*/
	this.response = function(request, response) {
		//if no ID
		if(!request.variables[0]) {
			//setup an error
			this.Controller().trigger('auth-detail-error', 'No ID set', request, response);
			return;
		}
		
		var search = this.Controller()
			.package('auth')
			.search()
			.addFilter('auth_id = ?', request.variables[0])
			.innerJoinOn('user', 'auth_user = user_id')
			.getRow(this._results.bind(this.Controller(), request, response));
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	this._results = function(request, response, error, data) {
		//if there are errors
		if(error) {
			//setup an error
			this.trigger('auth-detail-error', error, request, response);
			return;
		}
		
		//no error
		this.trigger('auth-detail-success', data, request, response);
	};
	
	/* Private Methods
	-------------------------------*/
}).singleton();