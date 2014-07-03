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
		//if no ID
		if(!this.request.variables[0]) {
			//setup an error response
			this.response.message = JSON.stringify({ 
				error: true, 
				message: 'No ID set' });
			
			//trigger that a response has been made
			this.controller.trigger('file-action-response', this.request, this.response);
			
			return;
		}
		
		var self = this;

		this.controller
			//when there is an error
			.once('file-remove-error', _error.bind(this))
			//when it is successfull
			.once('file-remove-success', _success.bind(this))
			//Now call to remove the file
			.trigger('file-remove', this.controller, this.request.variables[0]);
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
		
		// do not listen to error anymore
		this.controller.unlisten('file-remove-error');
		//trigger that a response has been made
		this.controller.trigger('file-action-response', this.request, this.response);
	};
	
	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error: true, 
			message: error.message });
		
		// do not listen to success anymore
		this.controller.unlisten('file-remove-success');
		//trigger that a response has been made
		this.controller.trigger('file-action-response', this.request, this.response);
	};

	/* Adaptor
	-------------------------------*/
	return c; 
})();