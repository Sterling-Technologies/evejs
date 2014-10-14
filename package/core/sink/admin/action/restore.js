define(function() {
   return jQuery.eve.action.extend(function() {
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
		this.response = function() {
			var url = this.getServerUrl() + '/sink/restore/';
			
			var id 	= window.location.pathname.split('/')[3];
			
			$.getJSON(url + id, function(response) {
				//if error
				if(response.error) {
					controller().notify('Error', response.message, 'error');
				} else {
					controller().notify('Success', 'Item has been restored!', 'success');
				}
				
				window.history.back();
			});
				
			return this;
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	});
});