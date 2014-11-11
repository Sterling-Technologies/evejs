define(function() {
   return jQuery.eve.base.extend(function() {
		/* Require
		-------------------------------*/
		var $ = jQuery;
		
		/* Constants
		-------------------------------*/
		/* Public.Properties
		-------------------------------*/
		/* Protected Properties
		-------------------------------*/
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		this.response = function(request) {
			//if no ID
			if(!request.variables[0]) {
				//setup an error
				this.Controller().notify('Error', 'No ID set', 'error');
				window.history.back();
				return this;
			}
			
			var id 	= request.variables[0];
			this.Controller().trigger('{{name}}-restore', id, request, this);
			return this;
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	}).singleton();
});