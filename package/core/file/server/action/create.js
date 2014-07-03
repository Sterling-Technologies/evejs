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
		//1. TRIGGER
		this.controller
			//when there is an error 
			.once('file-create-error', _error.bind(this))
			//when it is successfull
			.once('file-create-success', _success.bind(this))
			//Now call to remove the file
			.trigger('file-create', this.controller, this.request.stream);
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
		this.controller.unlisten('file-create-error');
		//trigger that a response has been made
		this.controller.trigger('file-action-response', this.request, this.response);
	};
	
	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error: true, 
			message: error.message });
		
		// do not listen to success anymore
		this.controller.unlisten('file-create-success');
		//trigger that a response has been made
		this.controller.trigger('file-action-response', this.request, this.response);
	};

	/* Adaptor
	-------------------------------*/
	return c; 
})();