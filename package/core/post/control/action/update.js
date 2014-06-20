define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.title        = 'Updating {USER}';
    public.header       = 'Updating {USER}';
    public.subheader    = 'CRM';
	
    public.crumbs = [{ 
        path: '/post',
        icon: 'post', 
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
			.then(_setCountries)
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
		this.data.country 	= this.countries;
		
		var post = controller.getPost();
		
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
				if(response.results.birthdate 
				&& (new Date(response.results.birthdate)).getTime() > 0) {
					//convert date format
					var birth 	= new Date(response.results.birthdate);
					
					var year 	= birth.getFullYear(),
						month 	= birth.getMonth() < 9 ? '0'+(birth.getMonth() + 1) : (birth.getMonth() + 1),
						day 	= birth.getDate() < 10 ? '0'+(birth.getDate()) : (birth.getDate());
					
					response.results.birthdate = [year, month, day].join('-');
				} else {
					response.results.birthdate = null;
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
        'text!' + controller.path('post/template') +  '/form/basic.html',
        'text!' + controller.path('post/template') +  '/form/company.html',
        'text!' + controller.path('post/template') +  '/form/contact.html',
        'text!' + controller.path('post/template') +  '/form/picture.html',
        'text!' + controller.path('post/template') +  '/form/required.html',
        'text!' + controller.path('post/template') +  '/form/tabs.html',
        'text!' + controller.path('post/template') +  '/form/social.html'];

        //require form templates
        //assign it to main form
        require(templates, function(form, basic, company, 
		contact, picture, required, tabs, social) {
            //load basic form template 
            this.data.basic = Handlebars.compile(basic)(this.data);

            //load company form template
            this.data.company = Handlebars.compile(company)(this.data);

            //load contact form template
            this.data.contact = Handlebars.compile(contact)(this.data);
            
            //load picture form template
            this.data.picture = Handlebars.compile(picture)(this.data);

            //load required form template
            this.data.required = Handlebars.compile(required)(this.data);

            //load tabs template
            this.data.tabs = Handlebars.compile(tabs)(this.data);

            //load social form template
            this.data.social = Handlebars.compile(social)(this.data);
        
			//render the body
			var body = Handlebars.compile(form)(this.data);
			
			controller
				.setTitle(this.title.replace('{USER}', this.data.post.name))
				.setHeader(this.header.replace('{USER}', this.data.post.name))
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);            
				
			next();
		}.bind(this));
    };

    var _listen = function(next) {
	   	$('section.post-profile form.package-post-form input[name="name"]').keyup(function(e) {
			var name = $(this);
			//there's a delay in when the input value is updated
			//we do this settime out to case for this
			setTimeout(function() {
				$('input[name="slug"]').val($.trim(name.val()
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
		if(!this.data.post.name || !this.data.post.name.length) {
			this.data.errors.name = { message: 'Post cannot be empty.'};
		}
		
		if(!this.data.post.slug || !this.data.post.slug.length) {
			this.data.errors.slug = { message: 'Postname cannot be empty.'};
		}
		
		if(!this.data.post.email || !this.data.post.email.length) {
			this.data.errors.email = { message: 'Email cannot be empty.'};
		}
		
		if(this.data.post.password 
		&& this.data.post.password.length
		&& (!this.data.post.confirm 
		|| !this.data.post.confirm.length)) {
			this.data.errors.confirm = { message: 'You must confirm your password.'};
		}
		
		if(this.data.post.password 
		&& this.data.post.password.length
		&& this.data.post.confirm 
		&& this.data.post.confirm.length
		&& this.data.post.password != this.data.post.confirm) {
			this.data.errors.confirm = { message: 'Password and confirm do not match.'};
		}
		
		//if we have no errors
		return JSON.stringify(this.data.errors) == '{}';
	};
	
	var _process = function(next) {
		var id 		=  window.location.pathname.split('/')[3],
			url 	= controller.getServerUrl() + '/post/update/'+id;
		
		//don't store the confirm
		delete this.data.post.confirm;
		
		if(this.data.post.birthdate) {
			this.data.post.birthdate += 'T00:00:00Z';
		}
		
		//save data to database
		$.post(url, this.data.post, function(response) {
			response = JSON.parse(response);
			
			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', 'Post successfully created!', 'success')
					//go to listing
					.redirect('/post');
				
				//no need to next since we are redirecting out
				return;
			}
			
			this.data.errors = response.validation || {};
			
			//display message status
			controller.notify('Error', 'There was an error in the form.', 'error');
			
			next();
	   }.bind(this));
	};
	
	var _setCountries = function(next) {
		var self = this;
		require([controller.path('config') + '/countries.js'], function(countries) {
			self.countries = countries;
			next();
		});
	};
    
    /* Adaptor
    -------------------------------*/
    return c; 
});