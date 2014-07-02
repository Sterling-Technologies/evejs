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
		var self = this, token = this.request.query['access_token'];

		if(token === undefined || token == null) {
			this.response.message = JSON.stringify({
				error   : true,
				message : 'Unauthorized Request'
			});

			this.controller.trigger('auth-action-response',
			this.request, this.response);
			return;
		}

		// Listen to login events
		this.controller
		// If there is an error logging in
		.once('auth-resource-error', function(error) {
			this.response.message = JSON.stringify({
				error  	 : true,
				message  : error
			});

			// Send out response message
			this.controller.trigger('auth-action-response',
			this.request, this.response);
		}.bind(this))
		// If there is no error
		.once('auth-resource-success', function() {
			// Noop
		})
		// Trigger Oauth Access Event
		.trigger('auth-resource', this.controller, token);

		return this;
	};

	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();