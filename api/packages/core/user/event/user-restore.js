module.exports = (function() { 
	var c = function(controller, request) {
		c.prototype.__construct.call(this, controller, request);
    }, public = c.prototype;
	/* Public Properties
    -------------------------------*/
    public.controller  	= null;
    public.request   	= null;
    
	/* Private Properties
    -------------------------------*/
    /* Loader
    -------------------------------*/
    public.__load = c.load = function(controller, request) {
        return new c(controller, request);
    };
    
	/* Construct
    -------------------------------*/
	public.__construct = function(controller, request) {
		//set request and other usefull data
		this.controller = controller;
		this.request  	= request;
		c.prototype.render(controller, request);
		//public.render();
	};

	/* Public Methods
    -------------------------------*/
	public.render = function(controller, request) {
		//remove
		controller
			.user()
			.store()
			.restore(request, function(error) {
				//if there are errors
				if(error) {
					//trigger an error
					controller.trigger('user-restore-error', error);
					return;
				}
				
				//trigger that we are good
				controller.trigger('user-restore-success');
			});
	}
	
	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();