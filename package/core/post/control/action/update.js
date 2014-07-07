define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.title        = 'Updating {POST}';
    public.header       = 'Updating {POST}';
    public.subheader    = 'CRM';
	
    public.crumbs = [{ 
        path: '/post',
        icon: 'pencil', 
        label: 'Posts' 
    }, {  label: 'Create Post' }];
	
    public.data     = {};
	
    public.template = controller.path('post/template') + '/form.html';
    
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
		this.data.mode 		= 'update';
		this.data.url 		= window.location.pathname;
		
		var post = controller.getPost();

		// store categories in data
		this.data.category  = this.categories;
		
		if(post && post.length) {
			//query to hash
			this.data.post = $.queryToHash(post);
			
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
		
		//if no data post set
		if(!this.data.post) {
			
			//get it from the server
			//get post id
			var id =  window.location.pathname.split('/')[3];
			var url = controller.getServerUrl() + '/post/detail/'+id;
			
			$.getJSON(url, function(response) {
				//format the birth to the HTML5 date format
				if(response.results.published 
				&& (new Date(response.results.published)).getTime() > 0) {
					//convert date format
					var published 	= new Date(response.results.published);
					
					var year 	= published.getFullYear(),
						month 	= published.getMonth() < 9 ? '0'+(published.getMonth() + 1) : (published.getMonth() + 1),
						day 	= published.getDate() < 10 ? '0'+(published.getDate()) : (published.getDate());
						
					response.results.published = [month, day, year].join('/');
				} else {
					response.results.published = null;
				}
				
				this.data.post = response.results;
				
				next();
			}.bind(this));
			
			return;
		}
		
        next();
    };
    
    var _output = function(next) {
		//store form templates path to array
        var templates = [
        'text!' + controller.path('post/template') +  '/form.html',
        'text!' + controller.path('post/template') +  '/form/publish.html',
        'text!' + controller.path('post/template') +  '/form/copy.html'];

        //require form templates
        //assign it to main form
        require(templates, function(form, publish, copy) {
            //load publish form template 
            this.data.publish = Handlebars.compile(publish)(this.data);

            //load copy form template
            this.data.copy = Handlebars.compile(copy)(this.data);

			//render the body
			var body = Handlebars.compile(form)(this.data);
			
			controller
				.setTitle(this.title.replace('{POST}', this.data.post.title))
				.setHeader(this.header.replace('{POST}', this.data.post.title)) 
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body); 

				// event when the post view is ready
				controller.trigger('post-ready');

			next();
		}.bind(this));
    };

    var _listen = function(next) {
	   	$('form.package-post-form').on('keyup', 'input[name="title"]', function(e) {
			var name = $(this);
			//there's a delay in when the input value is updated
			//we do this settime out to case for this
			setTimeout(function() {
				$('form.package-post-form input[name="slug"]').val($.trim(name.val()
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
		if(!this.data.post.title || !this.data.post.title.length) {
			this.data.errors.title = { message: 'Post cannot be empty.'};
		}
		
		if(!this.data.post.slug || !this.data.post.slug.length) {
			this.data.errors.slug = { message: 'Slug cannot be empty.'};
		}
		
		if(!this.data.post.detail || !this.data.post.detail.length) {
			this.data.errors.detail = { message: 'Detail cannot be empty.'};
		}
		
		//if we have no errors
		return JSON.stringify(this.data.errors) == '{}';
	};
	
	var _process = function(next) {
		var id 		=  window.location.pathname.split('/')[3],
			url 	= controller.getServerUrl() + '/post/update/'+id;
		
		if(this.data.post.published) {
			var published = this.data.post.published.split('/');
			this.data.post.published = published[2] 
				+ '-' + published[1] + '-' + published[0] 
				+ 'T00:00:00Z';
		}
		
		//save data to database
		$.post(url, this.data.post, function(response) {
			response = JSON.parse(response);
			
			if(!response.error) {
				controller				
					//display message status
					.notify('Success', 'Post successfully updated!', 'success')
					//go to listing
					.redirect('/post');

				// fire an event to notify listeners that
				// a post have been modified
				controller.trigger('post-updated', this.data.post.category);
				
				//no need to next since we are redirecting out
				return;
			}
			
			this.data.errors = response.validation || {};
			
			//there is data, fix published
			if(this.data.post.published) {
				//convert date format
				var published 	= new Date(this.data.post.published);
				
				var year 	= published.getFullYear(),
					month 	= published.getMonth() < 9 ? '0'+(published.getMonth() + 1) : (published.getMonth() + 1),
					day 	= published.getDate() < 10 ? '0'+(published.getDate()) : (published.getDate());
				
				this.data.post.published = [year, month, day].join('-');
			}
			
			//display message status
			controller.notify('Error', 'There was an error in the form.', 'error');
			
			next();
	   }.bind(this));
	};
    
    /* Adaptor
    -------------------------------*/
    return c; 
});