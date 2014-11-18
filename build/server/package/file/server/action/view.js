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
			.addFilter('file_id = ?', request.variables[0])
			.getRow(this._results.bind(this.Controller(), request, response));
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	this._results = function(request, response, error, data) {
		//if there are errors
		if(error || data === null) {
			//setup an error
			response.state = 404;
			response.message = 'File not found';
			
			//trigger that a response has been made
			this.trigger('file-response', request, response);
			
			return;
		}
		
		//then prepare the package
		this.File(data.file_path).getContent(function(error, content) {
			response.message = content.toString('base64');
			response.encoding = 'base64';
			response.headers['Content-Type'] = data.file_mime;
			//response.headers['Content-Length'] 	= response.message.length
			//trigger that a response has been made
			this.trigger('file-response', request, response);;
		}.bind(this));
	};
	
	/* Private Methods
	-------------------------------*/
}).singleton();