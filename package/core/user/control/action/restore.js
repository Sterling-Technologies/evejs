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
		var url = controller.getServerUrl() + '/user/restore/';
		var id 	= window.location.pathname.split('/')[3];
		
		$.getJSON(url + id, function(response) {
    		//if error
    		if(response.error) {
    			controller.addMessage(response.message, 'danger', 'exclamation-sign');
			} else {
				controller.addMessage(response.results.name + ' has been restored!', 'success', 'check');
			}
			
			window.history.back();
			
			next();
    	});
	};
	
	/* Adaptor
	-------------------------------*/
	return c; 

});