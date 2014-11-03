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
		var filter 	= request.query.filter 	|| {},
			range 	= request.query.range 	|| 50,
			start 	= request.query.start 	|| 0,
			order 	= request.query.order 	|| {},
			count	= request.query.count 	|| 0,
			keyword	= request.query.keyword || null;
		
		var search = this.Controller()
			.package('file')
			.search()
			.setColumns('file_id', 'file_name', 'file_mime', 'file_active', 'file_created')
			.setStart(parseInt(start) || 0)
			.setRange(parseInt(range) || 0);
			
		if(typeof filter.file_active === 'undefined') {
			filter.file_active = 1;
		}
		
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
			or.push('file_name LIKE ?');

			search.addFilter('(' + or.join(' OR ') + ')', '%'+keyword+'%');
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
			this.trigger('file-list-error', error, request, response);
			return;
		}
		
		//no error
		this.trigger('file-list-success', data, request, response);
	};
	
	/* Private Methods
	-------------------------------*/
}).singleton();