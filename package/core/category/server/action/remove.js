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
		
		this.controller
			//when there is an error
			.once('category-remove-error', _error.bind(this))
			//when it is successfull
			.once('category-remove-success', _success.bind(this))
			//Now call to remove the category
			.trigger('category-remove', this.controller, this.request.variables[0]);
	};
	
	/* Private Methods
    -------------------------------*/
    var _success = function(row) {
		//set up a success response
		this.response.message = JSON.stringify({ error: false, results: row });
		//dont listen for error anymore
		this.controller.unlisten('category-remove-error');
		//trigger that a response has been made
		this.controller.trigger('category-action-response', this.request, this.response);
	};
	
	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error: true, 
			message: error.message });
			
		//dont listen for success anymore
		this.controller.unlisten('category-remove-success');
		//trigger that a response has been made
		this.controller.trigger('category-action-response', this.request, this.response);
	};
    
	/* Adaptor
	-------------------------------*/
	return c; 
})();