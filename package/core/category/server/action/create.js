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
		var self = this, query = this
			.controller.eden.load('string')
			.queryToHash(this.request.message);
		
		this.controller
			//when there is an error 
			.once('category-create-error', _error.bind(this))
			//when it is successfull
			.once('category-create-success', _success.bind(this))
			// trigger category create
			.trigger('category-create', this.controller, query);
	};
	
	/* Private Methods
    -------------------------------*/	
	var _success = function(result) {
		//no error, then prepare the package
		this.response.message = JSON.stringify({ 
			error 	: false, 
			results : result });
		
		// dont listen to error anymore
		this.controller.unlisten('category-create-error');
		//trigger that a response has been made
		this.controller.trigger('category-action-response', this.request, this.response);
	};
	
	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error 	: true, 
			message : error.message });
		
		// dont listen to success anymore
		this.controller.unlisten('category-create-success');
		//trigger that a response has been made
		this.controller.trigger('category-action-response', this.request, this.response);
	};

	/* Adaptor
	-------------------------------*/
	return c; 
})();