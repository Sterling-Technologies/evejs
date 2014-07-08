define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.title 		= 'Categories';
	public.header 		= 'Categories';
	public.subheader 	= 'List of Categories';
	public.crumbs 		= [{ icon: 'post', label: 'Categories' }];
	public.data 		= {};
	
	public.start		= 0;
	public.page 		= 1;
	public.range 		= 25;
	
	public.template 	= controller.path('category/template') + '/index.html';
	
	/* Private Properties
	-------------------------------*/
	var $ = jQuery;
	
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		return new c();
	};
	
	/* Construct
	-------------------------------*/
	public.__construct = function() {
		//reset data because of "pass by ref"
		this.data = {};
	};
	
	/* Public Methods
	-------------------------------*/
	public.render = function() {
		$.sequence()
			.setScope(this)
			.then(_setData)
			.then(_output)
			.then(_listen);
		
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	var _setData = function(next) {
		//use a batch call
		var batch = [], query = $.getUrlQuery();
		
		//1. get the list
		batch.push({ url: _getListRequest.call(this, query) });
		
		//2. get the active count
		batch.push({ url: _getActiveCountRequest.call(this, query) });
		
		//3. get the trash count
		batch.push({ url: _getTrashCountRequest.call(this, query) });
		
		//4. get all count
		batch.push({ url: _getAllCountRequest.call(this, query) });
		
		$.post(
			controller.getServerUrl() + '/category/batch', 
			JSON.stringify(batch), function(response) { 
			response = JSON.parse(response);
			
			var i, rows = [];
			
			//loop through data
			for(i in response.batch[0].results) {
				var updated = new Date(response.batch[0].results[i].updated);
				var created = new Date(response.batch[0].results[i].created);
				var format = $.timeToDate(updated.getTime(), true, true);
				var createdFormat = $.timeToDate(created.getTime(), true, true);
                
                //add it to row
				rows.push({
					id      	  : response.batch[0].results[i]._id,
					name    	  : response.batch[0].results[i].name,
					active		  : response.batch[0].results[i].active,
					created 	  : createdFormat,
					updated		  : format });
            }
			
			var showing = query.mode || 'active';
			showing = showing.toUpperCase().substr(0, 1) + showing.toLowerCase().substr(1);
			
			//1. List
			//2. Active Count
			//3. Trash Count
			//4. All Count
			this.data = {
				showing 	: showing,
				rows		: rows,
				mode		: query.mode || 'active',
				keyword		: query.keyword || null,
				active		: response.batch[1].results,
				trash		: response.batch[2].results,
				all			: response.batch[3].results,
				range		: this.range };
            
			next();
		}.bind(this));
	};

	var _output = function(next) {
		//bulk load the templates
		require(['text!' + this.template], function(template) {
			//render the body
			var body = Handlebars.compile(template)(this.data);
			
			controller
				.setTitle(this.title)
				.setHeader(this.header)
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);
			
			next();
		}.bind(this));
	};
	
	var _listen = function(next) {
		//listen to remove restore
		$('section.category-list a.remove, section.category-list a.restore').click(function(e) {
			e.preventDefault();
			$(this).parent().parent().remove();
		});
		
		$('section.category-list  tbody input[type="checkbox"]').click(function() {
			setTimeout(function() {	
				var allChecked = true;
				jQuery('tbody input[type="checkbox"]').each(function() {
					if(!this.checked) {
						allChecked = false;
					}
				});
				
				jQuery('th .checkall')[0].checked = allChecked;
			}, 1);
		});
		
		next();
	};
	
	var _getListRequest = function(request) {
		var query = {};
		
		query.filter 	= request.filter 	|| {};
		query.range		= request.range 	|| this.range;
		query.start 	= request.start 	|| this.start;
		
		if(request.page) {
			query.start = (request.page - 1) * this.range;
		}
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
		
		switch(request.mode || 'active') {
			case 'all':
				query.filter.active = 1;
				break;
			case 'active':
				query.filter.active = 1;
				break;
			case 'trash':
				query.filter.active = 0;
				break;
		}
		
		return '/category/list?' + $.hashToQuery(query);
	};
	
	var _getAllCountRequest = function(request) {
		var query = {};
		
		query.filter = request.filter || {};
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
		
		query.count = 1;
		query.filter.active = 1;
		
		return '/category/list?' + $.hashToQuery(query);
	};
	
	var _getPublishedCountRequest = function(request) {
		var query = {};
		
		query.filter = request.filter || {};
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
	
		query.count = 1;
		query.filter.status = 'published';
		
		return '/category/list?' + $.hashToQuery(query);
	};
	
	var _getReviewCountRequest = function(request) {
		var query = {};
		
		query.filter = request.filter || {};
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
		
		query.count = 1;
		query.filter.status = 'review';
		
		return '/category/list?' + $.hashToQuery(query);
	};
	
	var _getDraftCountRequest = function(request) {
		var query = {};
		
		query.filter = request.filter || {};
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
		
		query.count = 1;
		query.filter.status = 'draft';
		
		return '/category/list?' + $.hashToQuery(query);
	};
	
	var _getTrashCountRequest = function(request) {
		var query = {};
		
		query.filter = request.filter || {};
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
		
		query.count = 1;
		query.filter.active = 0;
		
		return '/category/list?' + $.hashToQuery(query);
	};

	var _getActiveCountRequest = function(request) {
		var query = {};

		query.filter = request.filter || {};

		if(request.keyword) {
			query.keyword = request.keyword;
		}

		query.count = 1;
		query.filter.active = 1;

		return '/category/list?' + $.hashToQuery(query);
	};
	
	/* Adaptor
	-------------------------------*/
	return c; 
});