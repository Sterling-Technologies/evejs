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
		var settings = this.String().queryToHash(this._request.message);
		
		this._controller
			//when there is an error 
			.once('sink-create-error', this._error.bind(this.capture()))
			//when it is successfull
			.once('sink-create-success', this._success.bind(this.capture()))
			//Now call to remove the sample
			.trigger('sink-create', settings);
	};
	
	/* Protected Methods
	-------------------------------*/
	this._success = function(id) {
		//set up a success response
		this._response.message = JSON.stringify({ error: false, results: id });
		//trigger that a response has been made
		this._controller.trigger('sink-action-response', this._request, this._response);
	};
			
	this._error = function(error) {
		if(typeof error === 'string') {
			error = { message: error, errors: [] };
		}
		
		//setup an error response
		this._response.message = JSON.stringify({ 
			error: true, 
			message: error.message,
			validation: error.errors || [] });
		
		//trigger that a response has been made
		this._controller.trigger('sink-action-response', this._request, this._response);
	};
	
	/* Private Methods
	-------------------------------*/
});