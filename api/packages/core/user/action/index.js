module.exports = (function() { 
	//Index file called
	var c = function(controller, request, response) {
        this.__construct.call(this, controller, request, response);
    }, public = c.prototype;

	/* Public Properties
    -------------------------------*/
    public.controller  = null;
    public.request   = null;
    public.response  = null;
         
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
		this.request  = request;
		this.response  = response;
	};

	public.render = function() {
		var action, 
			respMethod = this.response
			rest 	   = this.request;
		if(respMethod.variables[0]) {
			if(respMethod.method.toUpperCase() == 'PUT') {
				//it must be an update
				action = require('./update');

			} else if(respMethod.method.toUpperCase() == 'DELETE') {
				//it must be an removal
				action = require('./remove');

			}
			//it must be a detail
			action = require('./detail');

		} else if(respMethod.method.toUpperCase() == 'POST') {
			//it must be a create
			action = require('./create');

		} else {
			//it must be a listing
			action = require('./list');

		}

		action.load(this.controller, this.request, this.response).render();
		return;
	}
	/* Adaptor
	-------------------------------*/
	return c; 
})();