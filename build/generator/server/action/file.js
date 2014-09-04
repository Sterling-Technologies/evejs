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
		
		if(!this.request.variables[1]) {
			//setup an error
			_error.call(this, { message: 'No File Name set' });
			
			return;
		}
		
		var orm 		= require('mongoose'),
			database 	= orm.connection.db,
			gridStore	= orm.mongo.GridStore,
			objectId	= orm.mongo.ObjectID;
			
		
		var self = this, id  = new objectId(this.request.variables[0]);
		
		//setup the gridstore	
		(new gridStore(database, id, 'r', { root: '{{name}}' })).open(function(error, store) {
			//if there are errors
			if(error) {
				_error.call(self, error);
				return;
			}
			
			//make sure the filename matches what is found
			if(store.filename !== self.request.variables[1]) {
				_error.call(self, { message: 'File request is invalid' });
				return;
			}
			
			store.read(_response.bind(self, store));
		});

		return this;
	};
	
	/* Private Methods
    -------------------------------*/
	var _response = function(store, error, buffer) {
		//if there are errors
		if(error) {
			_error.call(this, error);
			return;
		}
		
		//set content type
		this.response.headers['Content-Type'] = store.contentType;
		this.response.headers['Content-Length'] = store.length;
		this.response.encoding = 'base64'; 
		//no error, then prepare the package
		_success.call(this, buffer.toString('base64'));
	};
	
	var _success = function(data) {
		//no error, then prepare the package
		this.response.message = data;
		
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