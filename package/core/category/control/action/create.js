define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.title        = 'Create Category';
    public.header       = 'Create Category';
    public.subheader    = 'Catalog';
	
    public.crumbs = [{ 
        path: '/category',
        icon: 'sitemap', 
        label: 'Category' 
    }, {  label: 'Create Category' }];
	
    public.data     = {};
	
    public.template = controller.path('category/template') + '/form.html';
    
    /* Private Properties
    -------------------------------*/
    var $ = jQuery;
    var parentId;
	
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
		this.data.mode 		= 'create';
		this.data.url 		= window.location.pathname;
		this.data.parent 	= 0;

		// if last url segment is not
		// equal to /category and /category/create
		if(controller.getUrlSegment(-1) !== 'category' &&
		   controller.getUrlSegment(-1) !== 'create') {
			this.data.parent = controller.getUrlSegment(-1);
		}

		var data = controller.getPost();

		if(data && data.length) {
			//query to hash
			this.data.category = $.queryToHash(data);
			
			if(!_valid.call(this)) {			
				//display message status
				controller.notify('Error', 'There was an error in the form.', 'error');
				next();
				
				return;
			}
			
			//we are good to send this up
			_process.call(this, next);
			next();
			return;
		}
		
        next();
    };
    
    var _output = function(next) {;
        require(['text!' + public.template], function(form) {
			//render the body
			var body = Handlebars.compile(form)(this.data);
			
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
		$('form.package-category-form').on('keyup', 'input[name="name"]', function(e) {
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
			this.data.errors.name = { message: 'Category name cannot be empty.'};
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
		var url = controller.getServerUrl() + '/category/create';
		
		// trigger category create before
		controller.trigger('category-create-before');

		//save data to database
		$.post(url, this.data.category, function(response) {
			response = JSON.parse(response);
			
			// trigger category create after
			controller.trigger('category-create-after', response.results);

			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', 'Category successfully created!', 'success');
				
				if(this.data.parent === 0) {
					return controller.redirect('/category');
				}

				return  controller.redirect('/category/child/' + this.data.parent);
			}
			
			this.data.errors = response.validation || {};
			
			//display message status
			controller.notify('Error', 'There was an error in the form.', 'error');
			
			next();
	   }.bind(this));
	};

    /* Adaptor
    -------------------------------*/
    return c; 
});