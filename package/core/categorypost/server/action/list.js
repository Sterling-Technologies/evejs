module.exports = (function() {
	var c = function(controller, request, response) {
        this.__construct.call(this, controller, request, response);
    }, public = c.prototype;

	/* Public Properties
    -------------------------------*/
    public.controller  	= null;
    public.request   	= null;
    public.response  	= null;
    
	/* Private Properties
    -------------------------------*/     
    /* Loader
    -------------------------------*/
    public.__load = c.load = function(controller, request, response) {
        return new c(controller, request, response);
    };
    
	/* Construct
    -------------------------------*/
	public.__construct = function(controller, request, response) {
		//set request and other usefull data
		this.controller = controller;
		this.request  	= request;
		this.response  	= response;
	};

	/* Public Methods
    -------------------------------*/
	public.render = function() {
		//remember the scope and load up the data store
		var self = this, store = this.controller.categorypost().store();

		this.controller.categorypost().store().find({}, function(err, data) {
			//if there are errors
			if(err) {
				//setup an error response
				self.response.message = JSON.stringify({ 
					error: true, 
					message: error.message });
				
				//trigger that a response has been made
				self.controller.trigger('categorypost-action-response', self.request, self.response);
				return;
			}

			//no error, then prepare the package
			self.response.message = JSON.stringify({ 
				error: false, 
				results: data });
			
			//trigger that a response has been made
			self.controller.trigger('categorypost-action-response', self.request, self.response);
		});
	};
	
	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();