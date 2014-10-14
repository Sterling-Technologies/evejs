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
		this._title 	= 'Items';
		this._header 	= 'Items';
		this._subheader = '';
		this._crumbs 	= [{ icon: 'Facebook', label: 'Items' }];
		this._data 		= {};
		
		this._start		= 0;
		this._page 		= 1;
		this._range 	= 25;
		
		this._template 	= controller().path('sink/template') + '/index.html';
		
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
				this.getServerUrl() + '/sink/batch', 
				JSON.stringify(batch), function(response) { 
				response = JSON.parse(response);
				
				var i, rows = [];
				
				//loop through data
				for(i in response.batch[0].results) {
					//OUTPUT
					//NOTE: BULK GENERATE
					
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
			$('section.sink-list a.remove, section.sink-list a.restore').click(function(e) {
				e.preventDefault();
				$(this).parent().parent().remove();
			});
			
			$('section.sink-list  tbody input[type="checkbox"]').click(function() {
				setTimeout(function() {	
					var allChecked = true;
					$('section.sink-list tbody input[type="checkbox"]').each(function() {
						if(!this.checked) {
							allChecked = false;
						}
					});
					
					$('section.sink-list th input.checkall')[0].checked = allChecked;
				}, 1);
			});
			
			//listen to remove restore
			$('section.sink-list th input.checkall').click(function() {
				var checked = this.checked;
				$('section.sink-list tbody input[type="checkbox"]').each(function() {
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
					query.filter.sink_active = 1;
					break;
				case 'trash':
					query.filter.sink_active = 0;
					break;
			}
			
			return '/sink/list?' + this.Hash().toQuery(query);
		};
		
		this._getActiveCountRequest = function(request) {
			var query = {};
			
			query.filter = request.filter || {};
			
			if(request.keyword) {
				query.keyword = request.keyword;
			}
		
			query.count = 1;
			query.filter.sink_active = 1;
			
			return '/sink/list?' + this.Hash().toQuery(query);
		};
		
		this._getTrashCountRequest = function(request) {
			var query = {};
			
			query.filter = request.filter || {};
			
			if(request.keyword) {
				query.keyword = request.keyword;
			}
			
			query.count = 1;
			query.filter.sink_active = 0; 
			return '/sink/list?' + this.Hash().toQuery(query);
		};
		
		/* Private Methods
		-------------------------------*/
	});
});