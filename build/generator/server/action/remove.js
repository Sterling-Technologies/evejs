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
		
		this.controller
			//when there is an error
			.once('{{name}}-remove-error', _error.bind(this))
			//when it is successfull
			.once('{{name}}-remove-success', _success.bind(this))
			//Now call to remove the {{name}}
			.trigger('{{name}}-remove', this.controller, this.request.variables[0]);
	};
	
	/* Private Methods
    -------------------------------*/
	var _success = function(row) {
		//set up a success response
		this.response.message = JSON.stringify({ error: false, results: row });
		//dont listen for error anymore
		this.controller.unlisten('{{name}}-remove-error');
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
			
		//dont listen for success anymore
		this.controller.unlisten('{{name}}-remove-success');
		//trigger that a response has been made
		this.controller.trigger('{{name}}-action-response', this.request, this.response);
	};
	
	/* Adaptor
	-------------------------------*/
	return Definition; 
})();