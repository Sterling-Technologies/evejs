define(function() {
   return jQuery.eve.base.extend(function() {
		/* Require
		-------------------------------*/
		var $ = jQuery;
		
		/* Constants
		-------------------------------*/
		/* Public.Properties
		-------------------------------*/
		/* Protected Properties
		-------------------------------*/
		this._title       	= '{{plural}}';
		this._data     		= { title: this._title };
		
		this._start		= 0;
		this._page 		= 1;
		this._range 	= 25;
		
		this._template 	= '/index.html';
		
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		this.response = function(request) {
			this.sync(this._setData.bind(this, request))
				.then(this._output.bind(this, request))
				.then(this._listen.bind(this, request));
		};
		
		/* Protected Methods
		-------------------------------*/
		this._setData = function(request, next) {
			//use a batch call
			var batch = this.Controller().package('batch');
			
			//1. get the list
			batch.add(this._getListRequest(request.data));
			
			//2. get the count
			batch.add(this._getCountRequest(request.data));
			
			batch.send(function(error, response) { 
				if(error) {
					this.Controller().notify('Error', error, 'error');
					return;
				}
				
				if(response.error) {
					this.Controller().notify('Error', response.message, 'error');
					return;
				}
				
				var i, rows = [];
				
				//loop through data
				for(i in response.batch[0].results) {
					//OUTPUT
					//NOTE: BULK GENERATE
					{{#loop fields ~}}
					{{~#when value.type '==' 'date' ~}}
					response.batch[0].results[i].{{../key}} = this.Time().toDate(response.batch[0].results[i].{{../key}}, 'F d, Y');
					{{/when~}}
					{{~#when value.type '==' 'datetime' ~}}
					response.batch[0].results[i].{{../key}} = this.Time().toDate(response.batch[0].results[i].{{../key}}, 'F d, Y g:i A');
					{{/when~}}
					{{~#when value.type '==' 'time' ~}}
					response.batch[0].results[i].{{../key}} = this.Time().toDate(response.batch[0].results[i].{{../key}}, 'g:i A');
					{{/when~}}
					{{~#when value.type '==' 'boolean' ~}}
					response.batch[0].results[i].{{../key}} = response.batch[0].results[i].{{../key}} ? 'Yes': 'No';
					{{/when~}}
					{{~/loop}}

					//add it to row
					rows.push(response.batch[0].results[i]);
				}
				
				//1. List
				//2. Active Count
				//3. Trash Count
				this._data = {
					rows	: rows,
					keyword	: request.data.keyword || null,
					count	: response.batch[1].results,
					range	: this._range };
				
				next();
			}.bind(this));
		};
	
		this._output = function(request, next) {
			var template = this.Controller().package('{{name}}').path('template') + this._template;
			
			//bulk load the templates
			require(['text!' + template], function(template) {
				//render the body
				var body = Handlebars.compile(template)(this._data);
				
				this.Controller() 
					.setTitle(this._title)
					.setBody(body)
					.trigger('{{name}}-list-output', request, this);
				
				next();
			}.bind(this));
		};
		
		this._listen = function(request, next) {
			next();
		};
		
		this._getListRequest = function(request) {
			var query = {};
			
			query.filter 	= request.filter 	|| {};
			query.range		= request.range 	|| this._range;
			query.start 	= request.start 	|| this._start;
			
			if(request.page) {
				query.start = (request.page - 1) * this._range;
			}
			
			if(request.keyword) {
				query.keyword = request.keyword;
			}
			
			{{#if active~}}
			query.filter.{{active}} = 1;
			{{/if~}}
			
			return '/{{name}}/list?' + this.Hash().toQuery(query);
		};
		
		this._getCountRequest = function(request) {
			var query = {};
			
			query.filter = request.filter || {};
			
			if(request.keyword) {
				query.keyword = request.keyword;
			}
			
			{{#if active}}
			query.filter.{{active}} = 1;
			{{/if}}
			query.count = 1;
			
			return '/{{name}}/list?' + this.Hash().toQuery(query);
		};
		
		/* Private Methods
		-------------------------------*/
	}).singleton();
});