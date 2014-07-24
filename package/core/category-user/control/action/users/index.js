define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.title        = 'Updating User Category';
    public.header       = 'Updating User Category';
    public.subheader    = 'CRM';
	
    public.crumbs = [{ 
        path: '/user',
        icon: 'user', 
        label: 'Users'
    }, {  label: 'Update User' }];

	public.data 	= {};
	public.template = controller.path('category-user/template') + '/users/index.html';

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
		$.sequence()
		 .setScope(this)
		 .then(_getCategories)
		 .then(_setData)
		 .then(_output)
		 .then(_listen);

		return this;
	};

	/* Private Methods
	-------------------------------*/
	var _getCategories = function(next) {
		var id  = controller.getUrlSegment(-1);
		var url = controller.getServerUrl() + '/user/detail/' + id + 
				  '?join[to]=categories&join[using]=categories._id';

		$.getJSON(url, function(response) {
			this.data.current = response.results.categories;

			next();
		}.bind(this));
	};

	var _setData = function(next) {
		this.data.id = controller.getUrlSegment(-1);

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
			}
			next();
		}.bind(this));
	};

	var _output = function(next) {
		require(['text!' + public.template], function(template) {
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
		var self = this;

		// initialize chosen
		$('.chosen').chosen();

		$('form.category-form').on('submit', function(e) {
			e.preventDefault();

			// set of categories
			var categories = [];

			// get selected categories
			$('select.chosen-select option:selected').each(function(key, option) {
				// push category id
				categories.push({ _id : jQuery(option).val() });
			});

			// if there is no categories selected
			if(categories.length === 0) {
				// just send nothing
				categories.push([{ _id : '' }]);
			}

			// join data
			var join = { _id : self.data.id, join : { categories : categories } };

			// join request url
			var url  = controller.getServerUrl() + '/user/join?collection=categories';

			// send join request
			$.post(url, join, function(response) {
				if(!response.error) {
					return controller
						  .notify('Success', 'Categories successfully updated!', 'success')
						  .redirect('/user/category/' + self.data.id);
				}

				return controller.notify('Error', 'There was error in the form!', 'error');
			}, 'json');
		});

		next();
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