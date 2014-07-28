define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.title        = 'Updating {CATEGORY}';
    public.header       = 'Updating {CATEGORY}';
    public.subheader    = 'Catalog';
	
    public.crumbs = [{ 
        path: '/category',
        icon: 'sitemap', 
        label: 'Categories' }];
	
    public.data     = {};
	
    public.template = controller.path('category/template') + '/form.html';
    
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
		this.data.mode 		= 'update';
		this.data.url 		= window.location.pathname;
		
		var category = controller.getPost();
		
		if(category && category.length) {
			//query to hash
			this.data.category = $.queryToHash(category);
			this.data.parent   = this.data.category.parent;
			
			if(!_valid.call(this)) {			
				//display message status
				controller.notify('Error', 'There was an error in the form.', 'error');
				next();
				
				return;
			}
			
			//we are good to send this up
			_process.call(this, next);
			
			return;
		}
		
		//if no data category set
		if(!this.data.category) {
			var id =  controller.getUrlSegment(-1);
			var url = controller.getServerUrl() + '/category/detail/' + id;
			
			$.getJSON(url, function(response) {
				this.data.category = response.results;
				this.data.parent   = this.data.category.parent;
				next();
			}.bind(this));
			
			return;
		}
		
        next();
    };
    
    var _output = function(next) {
        //require form templates
        //assign it to main form
        require(['text!' + public.template], function(form) {
			//render the body
			var body = Handlebars.compile(form)(this.data);
			
			controller
				.setTitle(this.title.replace('{CATEGORY}', this.data.category.name))
				.setHeader(this.header.replace('{CATEGORY}', this.data.category.name)) 
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);            
				
			next();
		}.bind(this));
    };

    var _listen = function(next) {
	   	$('form.package-category-form').on('keyup', 'input[name="title"]', function(e) {
			var name = $(this);
			//there's a delay in when the input value is updated
			//we do this settime out to case for this
			setTimeout(function() {
				$('form.package-category-form input[name="slug"]').val($.trim(name.val()
				.toLowerCase()
				.replace(/[^a-zA-Z0-9-_ ]/g, ''))
				.replace(/\s/g, '-')
				.replace(/^([a-z\u00E0-\u00FC])|\-([a-z\u00E0-\u00FC])/g, function ($1) {
					return $1.toLowerCase();
				}));
			}, 1);
		});
	   
	    next(); 
    };
	
	var _valid = function() {
		//clear errors
		this.data.errors = {};
		
		//local validate
		if(!this.data.category.name || !this.data.category.name.length) {
			this.data.errors.name = { message: 'Category cannot be empty.'};
		}
		
		if(!this.data.category.slug || !this.data.category.slug.length) {
			this.data.errors.slug = { message: 'Slug cannot be empty.'};
		}
		
		if(!this.data.category.type || !this.data.category.type.length) {
			this.data.category.type = 'category';
		}
		
		//if we have no errors
		return JSON.stringify(this.data.errors) == '{}';
	};
	
	var _process = function(next) {
		var id 	= controller.getUrlSegment(-1),
			url = controller.getServerUrl() + '/category/update/' + id;
		
		// trigger category update before
		controller.trigger('category-update-before');

		//save data to database
		$.post(url, this.data.category, function(response) {
			response = JSON.parse(response);
			
			// trigger category update after
			controller.trigger('category-update-after', response.results);

			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', 'Category successfully updated!', 'success');
				
				if(this.data.parent == 0) {
					return controller.redirect('/category');
				}

				return controller.redirect('/category/child/' + this.data.parent);
			}
			
			this.data.errors = response.validation || {};
			
			//display message status
			controller.notify('Error', 'There was an error in the form.', 'error');
			
			next();
	   }.bind(this));
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

				// push update category crumb
				this.crumbs.push({ label : 'Update Category' });
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