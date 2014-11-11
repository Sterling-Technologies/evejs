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
		//if no files
		if(request.files.length === 0) {
			//setup an error
			this.Controller().trigger('file-remove-error', 'No files uploaded', request, response);
			
			return;
		}
		
		this.Controller().trigger('file-create', request.files, request, response);
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
});