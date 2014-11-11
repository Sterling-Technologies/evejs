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
			if(!request.variables[0] || !request.variables[1]) {
				//setup an error
				this.Controller().notify('Error', 'No ID set', 'error');
				window.history.back();
				return this;
			}
			
			var {{from.schema.name}} 	= request.variables[0];
			var {{to.schema.name}} 	= request.variables[1];
			
			this.Controller().trigger('{{name}}-remove', {{from.schema.name}}, {{to.schema.name}}, request, this);
			
			return this;
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	}).singleton();
});