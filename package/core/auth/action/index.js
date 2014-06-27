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
		var self = this, query = this.controller.eden
				.load('string').queryToHash(this.request.message);

		// Validate Request
		if(!this.validateTokenRequest(query)) {
			// If request is not valid, do nothing
			return;
		}

		// Listen to login events
		this.controller
		// If there is an error logging in
		.once('auth-access-error', function(error) {
			// Don't listen to success anymore
			this.controller.unlisten('auth-access-success');

			this.response.message = JSON.stringify({
				error  	 : true,
				message  : error
			});

			// Send out response message
			this.controller.trigger('auth-action-response',
			this.request, this.response);
		}.bind(this))
		// If authentication is good
		.once('auth-access-success', function(message) {
			// Don't listen to error anymore
			this.controller.unlisten('auth-access-error');

			this.response.message = JSON.stringify({
				error 	: false,
				message : message
			});

			this.controller.trigger('auth-action-response',
			this.request, this.response);
		}.bind(this))
		// Trigger Auth Access Event
		.trigger('auth-access', this.controller, query);

		return this;
	};

	public.validateTokenRequest = function(query) {
		// Get headers
		var headers  = this.request.headers;
		// Load up eden string
		var string   = this.controller.eden.load('string');

		// We are only allowing post method
		if(this.request.method.toLowerCase() != 'post') {
			this.response.message = JSON.stringify({
				error  	 : true,
				message  : 'Invalid Username or Password'
			});

			// Send out response message
			this.controller.trigger('auth-action-response',
			this.request, this.response);
			return false;
		}

		// If username and password is not
		// present on the query
		if(!('username' in query) || !('password' in query)) {
			this.response.message = JSON.stringify({
				error  	 : true,
				message  : 'Username and Password field is required'
			});

			// Send out response message
			this.controller.trigger('auth-action-response',
			this.request, this.response);
			return false;
		}

		return true;
	};

	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();