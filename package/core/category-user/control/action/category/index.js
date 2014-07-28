define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.title        = 'Updating {CATEGORY}';
    public.header       = 'Updating {CATEGORY}';
    public.subheader    = 'Catalog';
	
	public.start		= 0;
	public.page 		= 1;
	public.range 		= 25;

    public.crumbs = [{ 
        path: '/category',
        icon: 'sitemap', 
        label: 'Categories'
    }, {  label: 'Update Category' }];

	public.data 	= {};
	public.template = controller.path('category-user/template') + '/category/index.html';

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
		this.data = {};
	};

	/* Public Methods
	-------------------------------*/
	public.render = function() {
		$.sequence()
		 .setScope(this)
		 .then(_updateCrumbs)
		 .then(_getCategory)
		 .then(_setData)
		 .then(_output)
		 .then(_listen);

		return this;
	};

	/* Private Methods
	-------------------------------*/
	var _getCategory = function(next) {
		// get category id
		var id  = controller.getUrlSegment(-1),
			url = controller.getServerUrl() + '/category/detail/' + id;

		// get category detail
		$.getJSON(url, function(response) {
			// store category information
			this.data.category = response.results;

			next();
		}.bind(this));
	};

	var _setData = function(next) {
		// get category id
		this.data.id = controller.getUrlSegment(-1);

		// batch request
		var batch = [], query = $.getUrlQuery();
		
		// get users list based on category
		batch.push({ url: _getListRequest.call(this, query) });
		
		// get active users count request based on category
		batch.push({ url: _getActiveCountRequest.call(this, query) });

		$.post(
			controller.getServerUrl() + '/user/batch', 
			JSON.stringify(batch), function(response) { 

			response = JSON.parse(response);
		
			var i, rows = [];
			
			//loop through data
			for(i in response.batch[0].results) {
				var updated = new Date(response.batch[0].results[i].updated);
				var format = $.timeToDate(updated.getTime(), true, true);

                //add it to row
				rows.push({
					id      	  : response.batch[0].results[i]._id,
					name    	  : response.batch[0].results[i].name,
					email    	  : response.batch[0].results[i].email,
					active		  : response.batch[0].results[i].active,
					updated 	  : format });
            }
			
			// Handlebars data
			this.data = {
				id 			: this.data.id,
				category 	: this.data.category,
				rows		: rows,
				active		: response.batch[1].results,
				range		: this.range };
            
			next();
		}.bind(this));
	};

	var _listen = function(next) {
		// listen for user create before
		controller
			// unlisten to user create before first
			.unlisten('user-create-before', _userCreateBefore)
			// listen for user create before again
			.once('user-create-before', _userCreateBefore.bind(this));

		// listen for user create after
		controller
			// unlisten to user create before first
			.unlisten('user-create-after', _userCreateAfter)
			// listen for user create after again
			.once('user-create-after', _userCreateAfter.bind(this));

		next();
	};

	var _userCreateBefore = function() {
		// ..
	};

	var _userCreateAfter = function(e, user) {
		// if from user create category
		if(window.location.pathname.indexOf('/user/create/category') === 0) {
			// get category id
			var category = controller.getUrlSegment(-1),
				// get user id
				user 	 = user._id,
				// user join request url
				url 	 = controller.getServerUrl() + '/user/join?collection=categories';

			// join request
			var join = [{ _id : category }];

			// join payload
			join = { _id : user, join : { categories : join }};

			// send join request
			$.post(url, join, function(response) {
				if(!response.error) {
					// it needs to be redirected like this
					// cause template needs to be updated
					window.location.href = '/category/users/' + category;
					return;
				}
			}, 'json');
		}
	};

	var _output = function(next) {
		require(['text!' + public.template], function(template) {
			var body = Handlebars.compile(template)(this.data);

			controller
				.setTitle(this.title.replace('{CATEGORY}', this.data.category.name))
				.setHeader(this.header.replace('{CATEGORY}', this.data.category.name))
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);

			next();
		}.bind(this));
	};

	var _getListRequest = function(request) {
		var query = {};
		
		query.filter 	= request.filter 	|| {};
		query.range		= request.range 	|| this.range;
		query.start 	= request.start 	|| this.start;
		
		if(request.page) {
			query.start = (request.page - 1) * this.range;
		}
		
		query.filter.active = 1;

		query.filter['categories._id'] = controller.getUrlSegment(-1);

		return '/user/list?' + $.hashToQuery(query);
	};

	var _getActiveCountRequest = function(request) {
		var query = {};

		query.filter = request.filter || {};

		query.count 		= 1;
		query.filter.active = 1;

		query.filter['categories._id'] = controller.getUrlSegment(-1);

		return '/user/list?' + $.hashToQuery(query);
	};


    var _updateCrumbs = function(next) {
		var id  = controller.getUrlSegment(-1),
			url = controller.getServerUrl() + '/category/list?filter[active]=1';

		$.getJSON(url, function(response) {
			// reset crumbs
			this.crumbs = [{ path : '/category', icon : 'sitemap', label : 'Categories' }];

			// get category parents
			var category = _traverseCategory(id, response.results);
			
			// clear up category tree
			tree = [];

			// if there is a category
			if(category !== undefined) {
				// for each category
				for(var i in category) {
					// push it to crumbs
					this.crumbs.push(category[i]);
				}

				// push users category crumb
				this.crumbs.push({ label : 'Users' });
			}

			next();
		}.bind(this));
	};

	var _traverseCategory = function(parent, categories) {
		// find out given category
		// parent
		for(var i in categories) {
			// current category id
			var id 	 = categories[i]._id;
			// current category parent
			var root = categories[i].parent;
			// current category name
			var name = categories[i].name;

			// if current id is
			// equal to the given
			// parent id
			if(id == parent) {
				// push category to tree
				tree.push({ path : '/category/child/' + id, label : name });

				// it means that we need to
				// re-call this function again
				return _traverseCategory(root, categories);
			}

			// if parent of current category
			// is 0, it means this is
			// the root category
			if(parent == 0) {
				// return category tree
				return tree.reverse();
			}
		}
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});