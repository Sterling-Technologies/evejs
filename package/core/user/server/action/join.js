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
		var collection = this.request.query.collection;
		
		//1. SETUP: change the string into a native object
		var query = this
			.controller.eden.load('string')
			.queryToHash(this.request.message);
			
		if(!collection) {
			return _error.call(this, { message : 'collection parameter is required' });
		}

		//2. TRIGGER
		this.controller
			//when there is an error 
			.once('user-join-error', _error.bind(this))
			//when it is successfull
			.once('user-join-success', _success.bind(this))
			//Now call to remove the user
			.trigger('user-join', this.controller, collection, query);
	};
	
	/* Private Methods
    -------------------------------*/
	var _success = function() {
		//set up a success response
		this.response.message = JSON.stringify({ error: false });
		//dont listen for error anymore
		this.controller.unlisten('user-join-error');
		//trigger that a response has been made
		this.controller.trigger('user-action-response', this.request, this.response);
	};
			
	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error: true, 
			message: error.message,
			validation: error.errors || [] });
		
		//dont listen for success anymore
		this.controller.unlisten('user-join-success');
		//trigger that a response has been made
		this.controller.trigger('user-action-response', this.request, this.response);
	};

	/* Adaptor
	-------------------------------*/
	return c; 
})();