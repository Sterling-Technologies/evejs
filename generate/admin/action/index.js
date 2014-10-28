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
		this._title 	= '{{plural}}';
		this._header 	= '{{plural}}';
		this._subheader = '';
		this._crumbs 	= [{ icon: '{{icon}}', label: '{{plural}}' }];
		this._data 		= {};
		
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
			
			{{#if active~}}
			//2. get the active count
			batch.add(this._getActiveCountRequest(request.data));
			
			//3. get the trash count
			batch.add(this._getTrashCountRequest(request.data));
			{{~else~}}
			//2. get the count
			batch.add(this._getCountRequest(request.data));
			{{/if~}}
			batch.send(function(error, response) { 
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
				
				var showing = request.data.mode || 'active';
				showing = showing.toUpperCase().substr(0, 1) + showing.toLowerCase().substr(1);
				
				//1. List
				//2. Active Count
				//3. Trash Count
				this._data = {
					showing : showing,
					rows	: rows,
					mode	: request.data.mode || 'active',
					keyword	: request.data.keyword || null,
					{{#if active~}}
					active	: response.batch[1].results,
					trash	: response.batch[2].results,
					{{~else~}}
					count	: response.batch[1].results,
					{{/if~}}
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
					.setHeader(this._header)
					.setSubheader(this._subheader)
					.setCrumbs(this._crumbs)
					.setBody(body)
					.trigger('{{name}}-list-output', request, this);
				
				next();
			}.bind(this));
		};
		
		this._listen = function(request, next) {
			//listen to remove restore
			$('section.{{name}}-list a.remove, section.{{name}}-list a.restore').click(function(e) {
				e.preventDefault();
				$(this).parent().parent().remove();
			});
			
			$('section.{{name}}-list  tbody input[type="checkbox"]').click(function() {
				setTimeout(function() {	
					var allChecked = true;
					$('section.{{name}}-list tbody input[type="checkbox"]').each(function() {
						if(!this.checked) {
							allChecked = false;
						}
					});
					
					$('section.{{name}}-list th input.checkall')[0].checked = allChecked;
				}, 1);
			});
			
			//listen to remove restore
			$('section.{{name}}-list th input.checkall').click(function() {
				var checked = this.checked;
				$('section.{{name}}-list tbody input[type="checkbox"]').each(function() {
					this.checked = checked;
				});
			});
			
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
			switch(request.mode || 'active') {
				case 'active':
					query.filter.{{active}} = 1;
					break;
				case 'trash':
					query.filter.{{active}} = 0;
					break;
			}
			{{/if~}}
			
			return '/{{name}}/list?' + this.Hash().toQuery(query);
		};
		
		{{#if active}}
		this._getActiveCountRequest = function(request) {
			var query = {};
			
			query.filter = request.filter || {};
			
			if(request.keyword) {
				query.keyword = request.keyword;
			}
		
			query.count = 1;
			query.filter.{{active}} = 1;
			
			return '/{{name}}/list?' + this.Hash().toQuery(query);
		};
		
		this._getTrashCountRequest = function(request) {
			var query = {};
			
			query.filter = request.filter || {};
			
			if(request.keyword) {
				query.keyword = request.keyword;
			}
			
			query.count = 1;
			query.filter.{{active}} = 0; 
			return '/{{name}}/list?' + this.Hash().toQuery(query);
		};
		
		{{~else~}}
		this._getCountRequest = function(request) {
			var query = {};
			
			query.filter = request.filter || {};
			
			if(request.keyword) {
				query.keyword = request.keyword;
			}
		
			query.count = 1;
			
			return '/{{name}}/list?' + this.Hash().toQuery(query);
		};
		
		{{/if~}}
		/* Private Methods
		-------------------------------*/
	}).singleton();
});