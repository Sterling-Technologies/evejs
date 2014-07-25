define(function() {
	var Definition = function() {}, prototype = Definition.prototype;
	
	/* Public Properties 
	-------------------------------*/
	prototype.data 	= {};

	/* Private Properties
	-------------------------------*/
	var $ = jQuery;
	
	/* Loader
	-------------------------------*/
	prototype.__load = Definition.load = function() {
		return new Definition();
	};

	/* Construct
    -------------------------------*/
    /* Public Methods
    -------------------------------*/
	prototype.render = function() { 
        $.sequence()
			.setScope(this)
        	.then(_process);
        
        return this;
    };
	
    /* Private Methods
    -------------------------------*/
	var _process = function(next) {
		var data = controller.getPost();
		
		if(!data || !data.length) {
			controller.notify('Error', 'No bulk action chosen.', 'error');
			window.history.back();
			//do nothing
			return;
		}
		
		data = $.queryToHash(data);
		
		//if nothing was checked
		if(!data.action) {
			controller.notify('Error', 'No bulk action chosen.', 'error');
			window.history.back();
			//do nothing
			return;
		}
		
		
		//if nothing was checked
		if(!data.id || !data.id.length) {
			controller.notify('Error', 'No items were chosen.', 'error');
			window.history.back();
			//do nothing
			return;
		}
		
		//what is the url base
		var url =  '/{SLUG}/' + data.action + '/';
		
		//prepare the batch query
		for(var batch = [], i = 0; i < data.id.length; i++) {
			batch.push({ url: url + data.id[i] });
		}
		
		//call the batch remove
		$.post(
		controller.getServerUrl() + '/{SLUG}/batch', 
		JSON.stringify(batch), function(response) { 
			response = JSON.parse(response);
			for(var errors = false, i = 0; i < response.length; i++) {
				if(response[i].error && response[i].message) {
					errors = true;
					controller.notify('Error', response[i].message, 'error');
				}
			}
			
			if(!errors) {
				controller.notify('Success', 'Bulk Action ' + data.action + ' successful!', 'success');
			}
			
			window.history.back();
		});
	};
	
	/* Adaptor
	-------------------------------*/
	return Definition; 

});