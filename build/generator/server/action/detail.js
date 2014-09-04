module.exports = (function() {
	var Definition = function(controller, request, response) {
        this.__construct.call(this, controller, request, response);
    }, prototype = Definition.prototype;

	/* Public Properties
    -------------------------------*/
    prototype.controller  	= null;
    prototype.request   	= null;
    prototype.response  	= null;
    
	/* Private Properties
    -------------------------------*/
    /* Loader
    -------------------------------*/
    prototype.__load = Definition.load = function(controller, request, response) {
        return new Definition(controller, request, response);
    };
    
	/* Construct
    -------------------------------*/
	prototype.__construct = function(controller, request, response) {
		//set request and other usefull data
		this.controller = controller;
		this.request  	= request;
		this.response  	= response;
	};

	/* Public Methods
	-------------------------------*/
	prototype.render = function() {
		//if no ID
		if(!this.request.variables[0]) {
			//setup an error
			_error.call(this, { message: 'No ID set' });
			
			return;
		}
		
		this.controller.{{name}}().store().getDetail(this.request.variables[0], _response.bind(this));

		return this;
	};
	
	/* Private Methods
    -------------------------------*/
	var _response = function(error, row) {
		//if there are errors
		if(error) {
			_error.call(this, error);
			return;
		}
		
		//no error, then prepare the package
		_success.call(this, row);
	};
	
	var _success = function(row) {
		//no error, then prepare the package
		this.response.message = JSON.stringify({ 
			error: false, 
			results: row });
		
		//trigger that a response has been made
		this.controller.trigger('{{name}}-action-response', this.request, this.response);
	};
	
	var _error = function(error) {
		if(typeof error === 'string') {
			error = { message: error, errors: [] };
		}
		
		//setup an error response
		this.response.message = JSON.stringify({ 
			error: true, 
			message: error.message });
		
		//trigger that a response has been made
		this.controller.trigger('{{name}}-action-response', this.request, this.response);
	};
	
	/* Adaptor
	-------------------------------*/
	return Definition; 
})();