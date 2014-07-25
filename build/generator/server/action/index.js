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
		var action = null;
		
		//if there is an idea
		if(this.request.variables[0]) {
			//and a put is made
			if(this.request.method.toUpperCase() === 'PUT') {
				//it must be an update
				action = require('./update');
			//is it a delete ?
			} else if(this.request.method.toUpperCase() === 'DELETE') {
				//it must be an removal
				action = require('./remove');
			} else {
				//it must be a detail
				action = require('./detail');
			}
		//is there a post ?
		} else if(this.request.method.toUpperCase() === 'POST') {
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
	return Definition; 
})();