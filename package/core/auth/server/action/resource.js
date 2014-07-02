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
		// Get request access token
		var token = this.request.query['access_token'];

		// If token is not present on the
		// request
		if(token === undefined || token == null) {
			return;
		}

		// Listen to login events
		this.controller
		// If there is an error logging in
		.once('auth-resource-error', _error.bind(this))
		// If there is no error
		.once('auth-resource-success', _success.bind(this))
		// Trigger  auth resource event
		.trigger('auth-resource', this.controller, token);

		return this;
	};

	/* Private Methods
    -------------------------------*/
    var _response = function(error, data) {
		//if there are errors
		if(error) {
			_error.call(this, error);
			return;
		}
		
		//no error
		_success.call(this, data);
	};
	
	var _success = function() {
		// noop
	};
	
	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error: true, 
			message: error.message });
		
		// don't listen for success anymore
		this.controller.trigger('auth-resource-success');
		//trigger that a response has been made
		this.controller.trigger('auth-action-response', this.request, this.response);
	};

	/* Adaptor
	-------------------------------*/
	return c; 
})();