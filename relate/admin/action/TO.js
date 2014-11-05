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
		this._title 	= '{{to.schema.plural}}';
		this._header 	= '{{to.schema.plural}}';
		this._subheader = '';
		this._crumbs = [{ 
			path: '/{{from.schema.name}}',
			icon: '{{from.schema.icon}}', 
			label: '{{from.schema.plural}}' 
		}, { 
			path: '/{{from.schema.name}}/update/',
			label: 'Updating {{from.schema.singular}}' 
		}, {  label: 'Updating {{to.schema.plural}}' }];
		
		this._data 		= {};
		
		this._start		= 0;
		this._page 		= 1;
		this._range 	= 25;
		
		this._template = '/{{to.schema.name}}.html';
		
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
			var batch = [];
			
			//1. get the list
			batch.push({ url: this._getListRequest(request.variables[0], request.data) });
			
			//2. get the active count
			batch.push({ url: this._getCountRequest(request.variables[0], request.data) });
			
			$.post(
				this.Controller().getServerUrl() + '/{{name}}/batch', 
				JSON.stringify(batch), function(response) { 
				response = JSON.parse(response);
				
				if(response.error) {
					this.Controller().notify('Error', response.message, 'error');
					return;
				}
				
				var i, rows = [];
				
				//loop through data
				for(i in response.batch[0].results) {
					//OUTPUT
					//NOTE: BULK GENERATE
					{{#loop to.schema.fields ~}}
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
					id		: request.variables[0],
					keyword	: request.data.keyword || null,
					count	: response.batch[1].results,
					range	: this._range };
				
				next();
			}.bind(this));
		};
		
		this._listen = function(request, next) {
			//add a field
			var self = this, body = Handlebars.compile("\{\{{block 'field/autocomplete' "
			+ "'{{to.schema.name}}' '' options 'placeholder=\"Add an existing {{to.schema.singular}}\"'\}\}}")({ 
				options: {
					name : '{{to.schema.name}}',
					template: '\{\{value\}\} <strong>( ID: \{\{id\}\} )</strong>',
					engine: {
						compile: function(template) {
							return {
								render: function(context) {
									return Handlebars.compile(template)(context);
								}
							};
						} 
						 
					},
					remote : {
						url: this.Controller().getServerUrl() + '/{{to.schema.name}}?keyword=%QUERY',
						filter: function(data) {
							var results = data.results.map(function (item) {
								return {
									id: item.{{to.schema.primary}},
									value: item.{{to.reference}} };
							});
					
							return results;
						}
					}
				}
			});
			
			body = $(body).on('ready', function() {
				$('input.eve-field-autocomplete', this)
				.on('typeahead:selected', __selected.bind(self, request))
				.on('typeahead:autocompleted', __selected.bind(self, request));
			}).css('float', 'left');
			
			$('section.{{name}}-{{to.schema.name}}-list div.create').before(body);
		};
		
		this._output = function(request, next) {
			var template = this.Controller().package('{{name}}').path('template') + this._template;
			
			//bulk load the templates
			require(['text!' + template], function(template) {
				//render the body
				var body = Handlebars.compile(template)(this._data);
				
				this._crumbs[1].path = '/{{from.schema.name}}/update/' + request.variables[0];
				
				this.Controller() 
					.setTitle(this._title)
					.setHeader(this._header)
					.setSubheader(this._subheader)
					.setCrumbs(this._crumbs)
					.setBody(body)
					.trigger('{{name}}-{{to.schema.name}}-output', request, this);
				
				next();
			}.bind(this));
		};
		
		this._getListRequest = function(id, request) {
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
			
			query.filter.{{to.schema.name}}_active = 1;
			
			return '/{{name}}/{{to.schema.name}}/' + id + '?' + this.Hash().toQuery(query);
		};
		
		this._getCountRequest = function(id, request) {
			var query = {};
			
			query.filter = request.filter || {};
			
			if(request.keyword) {
				query.keyword = request.keyword;
			}
		
			query.count = 1;
			query.filter.{{to.schema.name}}_active = 1;
			
			return '/{{name}}/{{to.schema.name}}/' + id + '?' + this.Hash().toQuery(query);
		};
		
		/* Private Methods
		-------------------------------*/
		var __selected = function(request, e, item) {
			//send
			var url = this.Controller().getServerUrl() + '/{{name}}/create/';
			var {{from.schema.name}} = request.variables[0];
			var {{to.schema.name}} = item.id;
			
			$.getJSON(url + {{from.schema.name}} + '/' + {{to.schema.name}}, function(response) {
				//if error
				if(response.error) {
					this.Controller().trigger('{{name}}-create-error', 
					response.message, {{from.schema.name}}, {{to.schema.name}}, request, this);
					return;	
				}
				
				this.Controller().trigger('{{name}}-create-success', {{from.schema.name}}, {{to.schema.name}}, request, this);
				
				//redirect out
				this.Controller().redirect(request.path);
			}.bind(this));
		};
		
	}).singleton();
});