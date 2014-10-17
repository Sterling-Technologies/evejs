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
			this.Controller().trigger('{{name}}-detail-error', 'No ID set', request, response);
			return;
		}
		
		var search = this.Controller()
			.{{name}}()
			.search()
			.addFilter('{{name}}_id = ?', request.variables[0])
			.getRow(this._results.bind(this.Controller(), request, response));
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	this._results = function(request, response, error, data) {
		//if there are errors
		if(error) {
			//setup an error
			this.trigger('{{name}}-detail-error', error, request, response);
			return;
		}
		
		//no error
		this.trigger('{{name}}-detail-success', data, request, response);
	};
	
	/* Private Methods
	-------------------------------*/
}).singleton();