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
		var action = null;
		
		//if there is an idea
		if(this.request.variables[0]) {
			//and a put is made
			if(this.request.method.toUpperCase() == 'PUT') {
				//it must be an update
				action = require('./update');
			//is it a delete ?
			} else if(this.request.method.toUpperCase() == 'DELETE') {
				//it must be an removal
				action = require('./remove');
			} else {
				//it must be a detail
				action = require('./detail');
			}
		//is there a {TEMPORARY} ?
		} else if(this.request.method.toUpperCase() == '{TEMPORARY}') {
			//it must be a create
			action = require('./create');
		//by default 
		} else {
			//it must be a listing
			action = require('./list');
		}

		action.load(this.controller, this.request, this.response).render();
	};
	
	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();