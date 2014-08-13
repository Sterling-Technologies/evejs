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
		var url = controller.getServerUrl() + '/{{name}}/remove/';
		var id 	= window.location.pathname.split('/')[3];
		
		$.getJSON(url + id, function(response) {
    		//if error
    		if(response.error) {
				controller.notify('Error', response.message, 'error');
			} else {
				controller.notify('Success', response.results.name + ' has been removed!', 'success');
			}
			
			window.history.back();
			
			next();
    	});
	};
	
	/* Adaptor
	-------------------------------*/
	return Definition; 

});