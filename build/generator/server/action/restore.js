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
			///setup an error
			error.call(this, { message: 'No ID set' });
			
			return;
		}
		
		var self = this;

		this.controller
			//when there is an error
			.once('sample-restore-error', _error.bind(this))
			//when it is successfull
			.once('sample-restore-success', _success.bind(this))
			//Now call to remove the Sample
			.trigger('sample-restore', this.controller, this.request.variables[0]);
	};
	
	/* Private Methods
    -------------------------------*/
	var _success = function(row) {
		//set up a success response
		this.response.message = JSON.stringify({ error: false, results: row });
		//dont listen for error anymore
		this.controller.unlisten('sample-restore-error');
		//trigger that a response has been made
		this.controller.trigger('sample-action-response', this.request, this.response);
	};
			
	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error: true, 
			message: error.message });
		
		//dont listen for success anymore
		this.controller.unlisten('sample-restore-success');
		//trigger that a response has been made
		this.controller.trigger('sample-action-response', this.request, this.response);
	};
			
	/* Adaptor
	-------------------------------*/
	return c; 
})();