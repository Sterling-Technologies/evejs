define(function() {
   return jQuery.eve.action.extend(function() {
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
		this._crumbs 	= [{ icon: 'Facebook', label: '{{plural}}' }];
		this._data 		= {};
		
		this._start		= 0;
		this._page 		= 1;
		this._range 	= 25;
		
		this._template 	= controller().path('{{name}}/template') + '/index.html';
		
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		/* Protected Methods
		-------------------------------*/
		this._setData = function(next) {
			//use a batch call
			var batch = [], query = this.String().pathToQuery(window.location.href);
			
			//1. get the list
			batch.push({ url: this._getListRequest(query) });
			
			//2. get the active count
			batch.push({ url: this._getActiveCountRequest(query) });
			
			//3. get the trash count
			batch.push({ url: this._getTrashCountRequest(query) });
			
			$.post(
				this.getServerUrl() + '/{{name}}/batch', 
				JSON.stringify(batch), function(response) { 
				response = JSON.parse(response);
				
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
				
				var showing = query.mode || 'active';
				showing = showing.toUpperCase().substr(0, 1) + showing.toLowerCase().substr(1);
				
				//1. List
				//2. Active Count
				//3. Trash Count
				this._data = {
					showing : showing,
					rows	: rows,
					mode	: query.mode || 'active',
					keyword	: query.keyword || null,
					active	: response.batch[1].results,
					trash	: response.batch[2].results,
					range	: this._range };
				
				next();
			}.bind(this));
		};
	
		this._output = function(next) {
			//bulk load the templates
			require(['text!' + this._template], function(template) {
				//render the body
				var body = Handlebars.compile(template)(this._data);
				
				controller() 
					.setTitle(this._title)
					.setHeader(this._header)
					.setSubheader(this._subheader)
					.setCrumbs(this._crumbs)
					.setBody(body);
				
				next();
			}.bind(this));
		};
		
		this._listen = function(next) {
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
			
			switch(request.mode || 'active') {
				case 'active':
					query.filter.{{name}}_active = 1;
					break;
				case 'trash':
					query.filter.{{name}}_active = 0;
					break;
			}
			
			return '/{{name}}/list?' + this.Hash().toQuery(query);
		};
		
		this._getActiveCountRequest = function(request) {
			var query = {};
			
			query.filter = request.filter || {};
			
			if(request.keyword) {
				query.keyword = request.keyword;
			}
		
			query.count = 1;
			query.filter.{{name}}_active = 1;
			
			return '/{{name}}/list?' + this.Hash().toQuery(query);
		};
		
		this._getTrashCountRequest = function(request) {
			var query = {};
			
			query.filter = request.filter || {};
			
			if(request.keyword) {
				query.keyword = request.keyword;
			}
			
			query.count = 1;
			query.filter.{{name}}_active = 0; 
			return '/{{name}}/list?' + this.Hash().toQuery(query);
		};
		
		/* Private Methods
		-------------------------------*/
	});
});