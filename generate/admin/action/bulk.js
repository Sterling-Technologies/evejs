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
			var data = this.getState().data;
			
			//if nothing was checked
			if(!data.action) {
				controller().notify('Error', 'No bulk action chosen.', 'error');
				window.history.back();
				//do nothing
				return this;
			}
			
			//if nothing was checked
			if(!data.id || !data.id.length) {
				controller().notify('Error', 'No items were chosen.', 'error');
				window.history.back();
				//do nothing
				return;
			}
			
			//what is the url base
			var url =  '/{{name}}/' + data.action + '/';
			
			//prepare the batch query
			for(var batch = [], i = 0; i < data.id.length; i++) {
				batch.push({ url: url + data.id[i] });
			}
			
			//call the batch remove
			$.post(
			this.getServerUrl() + '/{{name}}/batch', 
			JSON.stringify(batch), function(response) { 
				response = JSON.parse(response);
				for(var errors = false, i = 0; i < response.length; i++) {
					if(response[i].error && response[i].message) {
						errors = true;
						controller().notify('Error', response[i].message, 'error');
					}
				}
				
				if(!errors) {
					controller().notify('Success', 'Bulk Action ' + data.action + ' successful!', 'success');
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