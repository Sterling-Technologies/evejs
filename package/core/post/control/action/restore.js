define(function() {
	var c = function() {}, public = c.prototype;
	
	/* Public Properties 
	-------------------------------*/
	public.data 	= {};

	/* Private Properties
	-------------------------------*/
	var $ = jQuery;
	
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		return new c();
	};

	/* Construct
    -------------------------------*/
    /* Public Methods
    -------------------------------*/
	public.render = function() { 
        $.sequence()
			.setScope(this)
        	.then(_process);
        
        return this;
    };
	
    /* Private Methods
    -------------------------------*/
	var _process = function(next) {
		var url = controller.getServerUrl() + '/post/restore/';
		var id 	= window.location.pathname.split('/')[3];
		
		$.getJSON(url + id, function(response) {
    		//if error
    		if(response.error) {
				controller.notify('Error', response.message, 'error');
			} else {
				controller.notify('Success', response.results.name + ' has been restored!', 'success');
			}
			
			window.history.back();
			
			next();
    	});
	};
	
	/* Adaptor
	-------------------------------*/
	return c; 

});