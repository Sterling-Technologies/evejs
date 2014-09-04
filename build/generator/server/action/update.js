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
		
		var query = this
			.controller.eden.load('string')
			.queryToHash(this.request.message);
		
		//TRIGGER
		this.controller
			//when there is an error
			.once('{{name}}-update-error', _error.bind(this))
			//when it is successfull
			.once('{{name}}-update-success', _success.bind(this))
			//Now call to update the {{name}}
			.trigger('{{name}}-update', this.controller, this.request.variables[0], query, this.request.stream);
	};
	
	/* Private Methods
    -------------------------------*/
	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error: true, 
			message: error.message,
			validation: error.errors || [] });
		
		//dont listen for success anymore
		this.controller.unlisten('{{name}}-update-success');
		//trigger that a response has been made
		this.controller.trigger('{{name}}-action-response', this.request, this.response);
	};
			
	var _success = function() {
		//set up a success response
		this.response.message = JSON.stringify({ error: false });
		//dont listen for error anymore
		this.controller.unlisten('{{name}}-update-error');
		//trigger that a response has been made
		this.controller.trigger('{{name}}-action-response', this.request, this.response);
	};
	
	/* Adaptor
	-------------------------------*/
	return Definition; 
})();