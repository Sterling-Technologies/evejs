define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.data 	= {};
	public.template = controller.path('category-post/template') + '/post/widget.html';

	/* Private Properties
	-------------------------------*/
	var $ = jQuery;

	var tree = [];
	var list = [];

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
		controller.once('body', function() {
			$.sequence()
			 .setScope(this)
			 .then(_getPostCategories)
			 .then(_setData)
			 .then(_output)
			 .then(_listen);
		}.bind(this));

		return this;
	};

	/* Private Methods
	-------------------------------*/
	var _getPostCategories = function(next) {
		var id  = controller.getUrlSegment(-1);
		var url = controller.getServerUrl() + '/post/detail/' + id +
				  '?join[to]=categories&join[using]=categories._id';

		if(window.location.pathname.indexOf('/post/update') === 0) {
			var self = this;

			// sad, but we need to make this
			// synchronous :( bacause of same
			// request origin policy.
			$.ajax({
				url 	 : url,
				async 	 : false,
				dataType : 'json',
				success  : function(response) {
					if(!response.error) {
						self.data.current = response.results.categories;
					}

					next();
				}
			});
		}

		next();
	};

	var _setData = function(next) {
		// get list of categories
		var url = controller.getServerUrl() + '/category/list?filter[active]=1';

		$.getJSON(url, function(response) {
			this.data.categories = _buildCategory(response.results);

			// loop through categories and check
			// what categories the current user
			// has selected
			for(var i in this.data.categories) {
				for(var k in this.data.current) {
					if(this.data.current[k] === null) {
						continue;
					}

					if(this.data.current[k]._id._id == this.data.categories[i]._id) {
						this.data.categories[i].selected = true;
					}
				}

				// case if post create is from category-post
				if(window.location.pathname.indexOf('/post/create/category') === 0) {
					// get category id
					var id = controller.getUrlSegment(-1);

					if(this.data.categories[i]._id == id) {
						this.data.categories[i].selected = true;
					} 
				}
			}

			next();
		}.bind(this));
	};

	var _output = function(next) {
		require(['text!' + public.template], function(template) {
			var body = Handlebars.compile(template)(this.data);

			if($('aside.category-post-widget').length !== 0) {
				return next();
			}

			$('form.package-post-form .row').append(body);
			next();
		}.bind(this));
	};

	var _listen = function(next) {
		// category post chosen
		$('select.category-post-chosen').chosen();

		controller
			// clear all events first
			.unlisten('post-create-before', _postCreateUpdateBefore)
			// listen once post create before
			.once('post-create-before', _postCreateUpdateBefore.bind(this));

		controller
			// clear all events first
			.unlisten('post-create-after', _postCreateUpdateAfter)
			// listen once post create after
			.once('post-create-after', _postCreateUpdateAfter.bind(this));

		controller
			// clear all events first
			.unlisten('post-update-before', _postCreateUpdateBefore)
			// listen once post create before
			.once('post-update-before', _postCreateUpdateBefore.bind(this));

		controller
			// clear all events first
			.unlisten('post-update-after', _postCreateUpdateBefore)
			// listen once post update after
			.once('post-update-after', _postCreateUpdateAfter.bind(this));


		next();
	};

	var _postCreateUpdateBefore = function(e) {
		this.data.join = [];

		// get selected categories
		$('select.category-post-chosen option:selected').each(function(key, option) {
			this.data.join.push({ _id : $(option).val() });
		}.bind(this));
	};

	var _postCreateUpdateAfter = function(e, post) {
		// if post update
		if(window.location.pathname.indexOf('/post/update') === 0) {
			post._id = controller.getUrlSegment(-1);
		}

		var url  = controller.getServerUrl() + '/post/join?collection=categories',
			join = { _id : post._id, join : { categories : this.data.join } };

		$.ajax({ 
			url 	 : url, 
			data 	 : join, 
			type 	 : 'post',
			dataType : 'json',
			async 	 : false,
			success  : function(response) {
				if(!response.error) {
					// check if post create is from
					// category post
					if(window.location.pathname.indexOf('/post/create/category') === 0) {
						var id = controller.getUrlSegment(-1);
						// redirect back to category post
						// we need to redirect like this to
						// refresh the entire template
						window.location.href = '/category/post/' + id;
						return;
					}
				}
			}
		});
	};


	var _buildCategory = function(categories) {
		// clear out list
		list = [];

		// iterate on each category
		// on list
		for(var i in categories) {
			// temp handler
			var category = '';
			// current category id
			var id 		 = categories[i].id;
			// parent category id
			var parent 	 = categories[i].parent;
			// current category
			var current  = categories[i].name;

			// if the category has no parent
			if(parent == 0) {
				// add root category reference
				categories[i].tree = current;
				// push category to list
				list.push(categories[i]);

				continue;
			}

			// traverse category and get it's parent
			category = _traverseCategory(parent, categories);
			// clear up tree
			tree 	 = [];
			// add reference to categories
			categories[i].tree = category + ' > ' + current;
			// push category to list
			list.push(categories[i]);
		}

		return list;
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
				// push it into our queue
				tree.push(name);
				// it means that we need to
				// re-call this function again
				return _traverseCategory(root, categories);
			}

			// if parent of current category
			// is 0, it means this is
			// the root category
			if(parent == 0) {
				// reverse queue, then join using
				// > seperator
				tree = tree.reverse().join(' > ');
				// return category tree
				return tree;
			}
		}
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});