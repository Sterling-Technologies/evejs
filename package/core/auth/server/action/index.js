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
		var query = this.controller.eden
			.load('string').queryToHash(this.request.message);

		// Validate Request
		if(!this.validateTokenRequest(query)) {
			// If request is not valid, do nothing
			return;
		}

		// Listen to login events
		this.controller
			// When there is an error
			.once('auth-access-error', _error.bind(this))
			// When authentication is successful
			.once('auth-access-success', _success.bind(this))
			// Trigger Auth Access Event
			.trigger('auth-access', this.controller, query);

		return this;
	};

	public.validateTokenRequest = function(query) {
		// We are only allowing post method
		if(this.request.method.toLowerCase() != 'post') {
			return _error.call(this, { message : 'Invalid Request, request method must be post' });
		}

		// If username and password is not
		// present on the query
		if(!('username' in query) || !('password' in query)) {
			return _error.call(this, { message : 'Username and Password field is required' });
		}

		// If username or password is null
		if(query.username === null || query.password === null) {
			return _error.call(this, { message : 'Username and Password field is required' });
		}

		return true;
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
	
	var _success = function(data) {
		//then prepare the package
		this.response.message = JSON.stringify({ 
			error: false, 
			results: data });
		
		// don't listen for error anymore
		this.controller.unlisten('auth-access-error');
		//trigger that a response has been made
		this.controller.trigger('auth-action-response', this.request, this.response);
	};
	
	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error: true, 
			message: error.message });
		
		// don't listen for success anymore
		this.controller.unlisten('auth-access-success');
		//trigger that a response has been made
		this.controller.trigger('auth-action-response', this.request, this.response);
	};

	/* Adaptor
	-------------------------------*/
	return c; 
})();