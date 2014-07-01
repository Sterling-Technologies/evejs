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
		//1. SETUP: change the string into a native object
		var query = this
			.controller.eden.load('string')
			.queryToHash(this.request.message);
		
		//2. TRIGGER
		this.controller
			//when there is an error 
			.once('{TEMPORARY}-create-error', _error.bind(this))
			//when it is successfull
			.once('{TEMPORARY}-create-success', _success.bind(this))
			//Now call to remove the {TEMPORARY}
			.trigger('{TEMPORARY}-create', this.controller, query);
	};
	
	/* Private Methods
    -------------------------------*/
	var _success = function() {
		//set up a success response
		this.response.message = JSON.stringify({ error: false });
		//dont listen for error anymore
		this.controller.unlisten('{TEMPORARY}-create-error');
		//trigger that a response has been made
		this.controller.trigger('{TEMPORARY}-action-response', this.request, this.response);
	};
	
	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error: true, 
			message: error.message,
			validation: error.errors || [] });
		
		//dont listen for success anymore
		this.controller.unlisten('{TEMPORARY}-create-success');
		//trigger that a response has been made
		this.controller.trigger('{TEMPORARY}-action-response', this.request, this.response);
	};
			
	/* Adaptor
	-------------------------------*/
	return c; 
})();