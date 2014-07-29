define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.title 		= 'Categories';
	public.header 		= 'Categories';
	public.subheader 	= 'Catalog';
	public.crumbs 		= [{ icon: 'sitemap', label: 'Categories' }];
	public.data 		= {};
	
	public.start		= 0;
	public.page 		= 1;
	public.range 		= 25;
	
	public.template 	= controller.path('category/template') + '/index.html';
	
	/* Private Properties
	-------------------------------*/
	var $ = jQuery;
	
	var tree = [];

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
			.then(_updateCrumbs)
			.then(_setData)
			.then(_output)
			.then(_listen);
		
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	var _setData = function(next) {
		this.data.id = 0;

		// if last url segment is not
		// equal to /category and /category/child
		if(controller.getUrlSegment(-1) !== 'category' &&
		   controller.getUrlSegment(-1) !== 'child') {
			// assign it as category id
			this.data.id = controller.getUrlSegment(-1);
		}

		//use a batch call
		var batch = [], query = $.getUrlQuery();
		
		//1. get the list
		batch.push({ url: _getListRequest.call(this, query) });
		
		//2. get the active count
		batch.push({ url: _getActiveCountRequest.call(this, query) });
		
		//3. get the trash count
		batch.push({ url: _getTrashCountRequest.call(this, query) });
		
		$.post(
			controller.getServerUrl() + '/category/batch', 
			JSON.stringify(batch), function(response) { 
			response = JSON.parse(response);
			
			var i, rows = [];
			
			//loop through data
			for(i in response.batch[0].results) {
				if(response.batch[0].results[i] !== undefined) {
	                //add it to row
					rows.push({
						id      	  : response.batch[0].results[i]._id,
						name    	  : response.batch[0].results[i].name,
						type    	  : response.batch[0].results[i].type,
						slug 		  : response.batch[0].results[i].slug,
						active		  : response.batch[0].results[i].active });
				}
            }
			
			var showing = query.mode || 'active';
			showing = showing.toUpperCase().substr(0, 1) + showing.toLowerCase().substr(1);
			
			//1. List
			//2. Active Count
			//3. Trash Count
			//4. All Count
			this.data = {
				id 			: this.data.id,
				showing 	: showing,
				rows		: rows,
				mode		: query.mode || 'active',
				keyword		: query.keyword || null,
				active		: response.batch[1].results,
				trash		: response.batch[2].results,
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
			case 'active':
				query.filter.active = 1;
				break;
			case 'trash':
				query.filter.active = 0;
				break;
		}

		// add category parent as filter
		query.filter.parent = this.data.id;
		
		return '/category/list?' + $.hashToQuery(query);
	};
	
	var _getTrashCountRequest = function(request) {
		var query = {};
		
		query.filter = request.filter || {};
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
		
		query.count 		= 1;
		query.filter.active = 0;
		
		// add category parent as filter
		query.filter.parent = this.data.id;

		return '/category/list?' + $.hashToQuery(query);
	};

	var _getActiveCountRequest = function(request) {
		var query = {};

		query.filter = request.filter || {};

		if(request.keyword) {
			query.keyword = request.keyword;
		}

		query.count 		= 1;
		query.filter.active = 1;

		// add category parent as filter
		query.filter.parent = this.data.id;

		return '/category/list?' + $.hashToQuery(query);
	};
	
	var _updateCrumbs = function(next) {
		var id  = controller.getUrlSegment(-1),
			url = controller.getServerUrl() + '/category/list?filter[active]=1';

		$.getJSON(url, function(response) {
			// reset crumbs
			this.crumbs = [{ icon : 'sitemap', label : 'Categories' }];

			// get category parents
			var category = _traverseCategory(id, response.results);
								
			// clear up category tree
			tree = [];

			// if there is a category
			if(category !== undefined) {
				// add link to category crumbs
				this.crumbs[0].path = '/category';

				// for each category
				for(var i in category) {
					if(category.hasOwnProperty(i)) {
						// push it to crumbs
						this.crumbs.push(category[i]);
					}
				}
			}

			next();
		}.bind(this));
	};

	var _traverseCategory = function(parent, categories) {
		// find out given category
		// parent
		for(var i in categories) {
			if(categories.hasOwnProperty(i)) {
				// current category id
				var id 	 = categories[i]._id;
				// current category parent
				var root = categories[i].parent;
				// current category name
				var name = categories[i].name;

				// if current id is
				// equal to the given
				// parent id
				if(id === parent) {
					// if current category
					if(controller.getUrlSegment(-1) === parent) {
						tree.push({ label : name });
					} else {
						// else let crumb to have link
						tree.push({ path : '/category/child/' + id, label : name });
					}

					// it means that we need to
					// re-call this function again
					return _traverseCategory(root, categories);
				}

				// if parent of current category
				// is 0, it means this is
				// the root category
				if(parseInt(parent) === 0) {
					// return category tree
					return tree.reverse();
				}
			}
		}
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});