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
			//setup an error
			_error.call(this, { message: 'No ID set' });
			
			return;
		}
		
		this.controller.{TEMPORARY}().store().getDetail(this.request.variables[0], _response.bind(this));

		return this;
	};
	
	/* Private Methods
    -------------------------------*/
	var _response = function(error, row) {
		//if there are errors
		if(error) {
			_error.call(this, error)
			return;
		}
		
		_success.call(this, row);
	};
	
	var _success = function(row) {
		//no error, then prepare the package
		this.response.message = JSON.stringify({ 
			error: false, 
			results: row });
		
		//trigger that a response has been made
		this.controller.trigger('{TEMPORARY}-action-response', this.request, this.response);
	};
	
	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error: true, 
			message: error.message });
		
		//trigger that a response has been made
		this.controller.trigger('{TEMPORARY}-action-response', this.request, this.response);
	};
	
	/* Adaptor
	-------------------------------*/
	return c; 
})();