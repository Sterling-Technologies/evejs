define(function() {
	var c = function() {}, public = c.prototype;
	
	/* Public Properties 
	-------------------------------*/
	public.data 	= {};

	/* Private Properties
	-------------------------------*/
	var $ 		= jQuery;
	var _api 	= 'http://api.eve.dev:8082/user/remove/';
	
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
		var url = controller.getServerUrl() + '/user/remove/';
		var id 	= window.location.pathname.split('/')[3];
		
		$.getJSON(url + id, function(response) {
    		//if error
    		if(response.error) {
    			return;
    		}
    	});
		
		next();
	};
	
	/* Adaptor
	-------------------------------*/
	return c.load(); 

});