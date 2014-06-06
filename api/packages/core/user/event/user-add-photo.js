module.exports = (function() { 
	var c = function(controller, request, source) {
		c.prototype.__construct.call(this, controller, request, source);
    }, public = c.prototype;
	/* Public Properties
    -------------------------------*/
    public.controller  	= null;
    public.request   	= null;
    public.sourced   	= null;
    
	/* Private Properties
    -------------------------------*/
    /* Loader
    -------------------------------*/
    public.__load = c.load = function(controller, request, source) {
        return new c(controller, request, source);
    };
    
	/* Construct
    -------------------------------*/
	public.__construct = function(controller, request, source) {
		//set request and other usefull data
		this.controller = controller;
		this.request  	= request;
		this.sourced   	= source;
		c.prototype.render(controller, request, source);
		//public.render();
	};

	/* Public Methods
    -------------------------------*/
	public.render = function(controller, request, source) {
		//remove
		controller
			.user()
			.store()
			.store
			//first find the id
			.findByIdAndUpdate(request, { $push: { address: source } }, function(error) {
				//if there are errors
				if(error) {
					//trigger an error
					controller.trigger('user-add-photo-error', error);
					return;
				}
				
				//trigger that we are good
				controller.trigger('user-add-photo-success');
			});
	}
	
	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();