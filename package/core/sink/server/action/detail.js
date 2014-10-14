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
	this.response = function() {
		//if no ID
		if(!this._request.variables[0]) {
			//setup an error
			this._error({ message: 'No ID set' });
			
			return;
		}
		
		var search = this._controller
			.sink()
			.search()
			.filterBySinkId(this._request.variables[0])
			.getRow(this._results.bind(this.capture()));
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	this._results = function(error, data) {
		//if there are errors
		if(error) {
			this._error.call(this, error);
			return;
		}
		
		//no error
		this._success.call(this, data);
	};
	
	this._success = function(data) {
		//then prepare the package
		this._response.message = JSON.stringify({ 
			error: false, 
			results: data });
		
		//trigger that a response has been made
		this._controller.trigger('sink-action-response', this._request, this._response);
	};
	
	this._error = function(error) {
		//setup an error response
		this._response.message = JSON.stringify({ 
			error: true, 
			message: error.message });
		
		//trigger that a response has been made
		this._controller.trigger('sink-action-response', this._request, this._response);
	};
	
	/* Private Methods
	-------------------------------*/
});