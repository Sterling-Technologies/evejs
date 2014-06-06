module.exports = (function() { 
	var c = function(controller, request, query) {
		c.prototype.__construct.call(this, controller, request, query);
    }, public = c.prototype;
	/* Public Properties
    -------------------------------*/
    public.controller  	= null;
    public.request   	= null;
    public.query   		= null;
    
	/* Private Properties
    -------------------------------*/
    /* Loader
    -------------------------------*/
    public.__load = c.load = function(controller, request, query) {
        return new c(controller, request, query);
    };
    
	/* Construct
    -------------------------------*/
	public.__construct = function(controller, request, query) {
		//set request and other usefull data
		this.controller = controller;
		this.request  	= request;
		this.query   	= query;
		c.prototype.render(controller, request, query);
		//public.render();
	};

	/* Public Methods
    -------------------------------*/
	public.render = function(controller, request, query) {
		//remove
		controller
			.user()
			.store()
			.store
			//first find the id
			.findByIdAndUpdate(request, { $push: { address: query } }, function(error) {
				//if there are errors
				if(error) {
					//trigger an error
					controller.trigger('user-add-address-error', error);
					return;
				}
				
				//trigger that we are good
				controller.trigger('user-add-address-success');
			});
	}
	
	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();