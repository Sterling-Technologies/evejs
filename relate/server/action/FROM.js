module.exports = require('edenjs').extend(function() {
	/* Require
	-------------------------------*/
	/* Constants
	-------------------------------*/
	/* Public Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	/* Public Methods
	-------------------------------*/
	this.response = function(request, response) {
		//if no ID
		if(!request.variables[0]) {
			//setup an error
			this.Controller().trigger('{{name}}-{{to.schema.name}}-list-error',  {
				message: 'No ID set'
			}, request, response);
			
			return;
		}
		
		var filter 	= request.query.filter 	|| {},
			range 	= request.query.range 	|| 50,
			start 	= request.query.start 	|| 0,
			order 	= request.query.order 	|| {},
			count	= request.query.count 	|| 0,
			keyword	= request.query.keyword || null;
		
		var search = this.Controller()
			.package('{{from.schema.name}}')
			.search()
			.innerJoinOn('{{name}}', '{{from.schema.primary}} = {{name}}.{{from.column}}')
			.addFilter('{{name}}.{{to.column}} = ?', request.variables[0])
			.setStart(parseInt(start) || 0)
			.setRange(parseInt(range) || 50);
		
		{{~#if from.schema.active}}
		if(typeof filter.{{from.schema.active}} === 'undefined') {
			filter.{{from.schema.active}} = 1;
		}
		{{/if}}
		
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
			{{~#loop from.schema.fields ~}}
			{{~#if value.search}}
			or.push('{{key}} LIKE ?');
			{{~/if}}
			{{~/loop}}

			search.addFilter('(' + or.join(' OR ') + ')'
					{{~#loop from.schema.fields ~}}
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
			search.getTotal(this._results.bind(this.Controller(), request, response));
			return this;
		}
		
		search.getRows(this._results.bind(this.Controller(), request, response));
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	this._results = function(request, response, error, data) {
		//if there are errors
		if(error) {
			//setup an error
			this.trigger('{{name}}-{{from.schema.name}}-list-error', error, request, response);
			return;
		}
		
		//no error
		this.trigger('{{name}}-{{from.schema.name}}-list-success', data, request, response);
	};
	
	/* Private Methods
	-------------------------------*/
}).singleton();