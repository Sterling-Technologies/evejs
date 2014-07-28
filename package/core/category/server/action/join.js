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
		var collection = this.request.query.collection, 
			query  	   = this.controller.eden.load('string')
						 .queryToHash(this.request.message);

		// if collection parameter
		// is not present
		if(!collection) {
			return _error.call(this, { message : 'collection parameter is required' });
		}

		this.controller
			// on category join error
			.once('category-join-error', _error.bind(this))
			// on category create success
			.once('category-join-success', _success.bind(this))
			// trigger category join action
			.trigger('category-join', this.controller, collection, query);
	};
	
	/* Private Methods
    -------------------------------*/
   	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error 		: true, 
			message		: error.message,
			validation	: error.errors || [] });
		
		//dont listen for success anymore
		this.controller.unlisten('category-join-success');
		//trigger that a response has been made
		this.controller.trigger('category-action-response', this.request, this.response);
	};
			
	var _success = function() {
		//set up a success response
		this.response.message = JSON.stringify({ error: false });
		//dont listen for error anymore
		this.controller.unlisten('category-join-error');
		//trigger that a response has been made
		this.controller.trigger('category-action-response', this.request, this.response);
	};

	/* Adaptor
	-------------------------------*/
	return c; 
})();