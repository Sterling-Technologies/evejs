module.exports = require('edenjs').extend(function() {
	/* Require
	-------------------------------*/
	/* Constants
	-------------------------------*/
	/* Public Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._controller  	= null;
    this._request   	= null;
    this._response  	= null;
	
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	this.___construct = function(controller, request, response) {
		this._controller  	= controller;
		this._request   	= request;
		this._response  	= response;
	};
	
	/* Public Methods
	-------------------------------*/
	this.request = function() {
		var action = null;
		
		//if there is an id
		if(this._request.variables[0]) {
			//and a put is made
			if(this._request.method.toUpperCase() == 'PUT') {
				//it must be an update
				action = require('./update');
			//is it a delete ?
			} else if(this._request.method.toUpperCase() == 'DELETE') {
				//it must be an removal
				action = require('./remove');
			} else {
				//it must be a detail
				action = require('./detail');
			}
		//is there a post ?
		} else if(this._request.method.toUpperCase() == 'POST') {
			//it must be a create
			action = require('./create');
		//by default 
		} else {
			//it must be a listing
			action = require('./list');
		}

		action = action.load(this._controller, this._request, this._response);
		
		//call the request now, if it exists
		if(typeof action.request === 'function') {
			action.request();
		}
		
		//if there's a response method, call it when it's ready
		if(typeof action.response === 'function') {
			this._controller.once('server-request-end', function() {
					action.response();				
			});
		}
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
});