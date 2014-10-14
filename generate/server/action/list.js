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
		var filter 	= this._request.query.filter 	|| {},
			range 	= this._request.query.range 	|| 50,
			start 	= this._request.query.start 	|| 0,
			order 	= this._request.query.order 	|| {},
			count	= this._request.query.count 	|| 0,
			keyword	= this._request.query.keyword 	|| null;
		
		var search = this._controller
			.{{name}}()
			.search()
			.setStart(parseInt(start) || 0)
			.setRange(parseInt(range) || 0);
		
		//add filters
		for(var column in filter) {
			if(filter.hasOwnProperty(column)) {
				if(/^[a-zA-Z0-9-_]+$/.test(column)) {
					search.addFilter(column + ' = ?', filter[column]);
				}
			}
		}
		
		//keyword?
		if(keyword) {
			var or = [];
			//BULK GENERATE
			{{~#loop fields ~}} 
			{{~#if value.search}}
			or.push('{{key}} LIKE ?');
			{{~/if}}
			{{~/loop}}
			
			search.addFilter('(' + or.join(' OR ') + ')'
				{{~#loop fields ~}} 
				{{~#if value.search~}}
				, '%'+keyword+'%'
				{{~/if}}
				{{~/loop}});
		}
		
		//add sorting
		for(column in order) {
			if(order.hasOwnProperty(column)) {
				search.addSort(column, column[order]);
			}
		}
		
		if(count) {
			search.getTotal(this._results.bind(this.capture()));
			return this;
		}
		
		search.getRows(this._results.bind(this.capture()));
		
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
		this._controller.trigger('{{name}}-action-response', this._request, this._response);
	};
	
	this._error = function(error) {
		//setup an error response
		this._response.message = JSON.stringify({ 
			error: true, 
			message: error.message });
		
		//trigger that a response has been made
		this._controller.trigger('{{name}}-action-response', this._request, this._response);
	};
	
	/* Private Methods
	-------------------------------*/
});