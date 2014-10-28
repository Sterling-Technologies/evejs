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
			var data = request.data;
			
			//if nothing was checked
			if(!data.action) {
				this.Controller().notify('Error', 'No bulk action chosen.', 'error');
				window.history.back();
				//do nothing
				return this;
			}
			
			//if nothing was checked
			if(!data.id || !data.id.length) {
				this.Controller().notify('Error', 'No items were chosen.', 'error');
				window.history.back();
				//do nothing
				return;
			}
			
			//what is the url base
			var url =  '/{{name}}/' + data.action + '/';
			
			//call the batch
			var batch = this.Controller().package('batch');
			
			//prepare the batch query
			for(var i = 0; i < data.id.length; i++) {
				batch.add(url + data.id[i]);
			}
			
			//call the batch remove
			batch.send(function(error, response) { 
				if(error) {
					this.Controller().notify('Error', error, 'error');
					return;
				}
				
				for(var errors = false, i = 0; i < response.length; i++) {
					if(response[i].error && response[i].message) {
						errors = true;
						this.Controller().notify('Error', response[i].message, 'error');
					}
				}
				
				if(!errors) {
					this.Controller().notify('Success', 'Bulk Action ' + data.action + ' successful!', 'success');
				}
				
				window.history.back();
			}.bind(this));
			
			return this;
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	});
});