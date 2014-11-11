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
		this._title 	= 'Users';
		this._header 	= 'Users';
		this._subheader = '';
		this._crumbs 	= [{ icon: 'user', label: 'Users' }];
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
			
			//2. get the active count
			batch.add(this._getActiveCountRequest(request.data));
			
			//3. get the trash count
			batch.add(this._getTrashCountRequest(request.data));
			
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
					active	: response.batch[1].results,
					trash	: response.batch[2].results,range	: this._range };
				
				next();
			}.bind(this));
		};
	
		this._output = function(request, next) {
			var template = this.Controller().package('user').path('template') + this._template;
			
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
					.trigger('user-list-output', request, this);
				
				next();
			}.bind(this));
		};
		
		this._listen = function(request, next) {
			//listen to remove restore
			$('section.user-list a.remove, section.user-list a.restore').click(function(e) {
				e.preventDefault();
				$(this).parent().parent().remove();
			});
			
			$('section.user-list  tbody input[type="checkbox"]').click(function() {
				setTimeout(function() {	
					var allChecked = true;
					$('section.user-list tbody input[type="checkbox"]').each(function() {
						if(!this.checked) {
							allChecked = false;
						}
					});
					
					$('section.user-list th input.checkall')[0].checked = allChecked;
				}, 1);
			});
			
			//listen to remove restore
			$('section.user-list th input.checkall').click(function() {
				var checked = this.checked;
				$('section.user-list tbody input[type="checkbox"]').each(function() {
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
					query.filter.user_active = 1;
					break;
				case 'trash':
					query.filter.user_active = 0;
					break;
			}
			return '/user/list?' + this.Hash().toQuery(query);
		};
		
		
		this._getActiveCountRequest = function(request) {
			var query = {};
			
			query.filter = request.filter || {};
			
			if(request.keyword) {
				query.keyword = request.keyword;
			}
		
			query.count = 1;
			query.filter.user_active = 1;
			
			return '/user/list?' + this.Hash().toQuery(query);
		};
		
		this._getTrashCountRequest = function(request) {
			var query = {};
			
			query.filter = request.filter || {};
			
			if(request.keyword) {
				query.keyword = request.keyword;
			}
			
			query.count = 1;
			query.filter.user_active = 0; 
			return '/user/list?' + this.Hash().toQuery(query);
		};/* Private Methods
		-------------------------------*/
	}).singleton();
});