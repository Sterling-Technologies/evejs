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
			this.Controller().trigger('file-detail-error', 'No ID set', request, response);
			return;
		}
		
		var search = this.Controller()
			.package('file')
			.search()
			.setColumns('file_id', 'file_name', 'file_mime', 'file_active', 'file_created')
			.addFilter('file_id = ?', request.variables[0])
			.getRow(this._results.bind(this.Controller(), request, response));
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	this._results = function(request, response, error, data) {
		//if there are errors
		if(error) {
			//setup an error
			this.trigger('file-detail-error', error, request, response);
			return;
		}
		
		//no error
		this.trigger('file-detail-success', data, request, response);
	};
	
	/* Private Methods
	-------------------------------*/
}).singleton();