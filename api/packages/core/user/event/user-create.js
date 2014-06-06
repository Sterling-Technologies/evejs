module.exports = (function() { 
	var c = function(controller, query) {
		c.prototype.__construct.call(this, controller, query);
    }, public = c.prototype;
	/* Public Properties
    -------------------------------*/
    public.controller  	= null;
    public.query   		= null;
    
	/* Private Properties
    -------------------------------*/
    /* Loader
    -------------------------------*/
    public.__load = c.load = function(controller, query) {
        return new c(controller, query);
    };
    
	/* Construct
    -------------------------------*/
	public.__construct = function(controller, query) {
		//set usefull data
		this.controller = controller;
		this.query  	= query;
		c.prototype.render(controller, query);
		//public.render();
	};

	/* Public Methods
    -------------------------------*/
	public.render = function(controller, query) {
		//remove
		controller
			.user()
			.store()
			.model(query)
			.save(function(error) {
				//if there are errors
				if(error) {
					//trigger an error
					controller.trigger('user-create-error', error);
					return;
				}
				
				//trigger that we are good
				controller.trigger('user-create-success');
			});
	}
	
	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();