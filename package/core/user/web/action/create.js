define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.title        = 'Create User';
    public.header       = 'Create User';
    public.subheader    = 'CRM';
	
    public.crumbs = [{ 
        path: '/user',
        icon: 'user', 
        label: 'Users' 
    }, {  label: 'Create User' }];
	
    public.data     = {};
	
    public.template = controller.path('user/template') + '/form.html';
    
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
		this.data.mode 		= 'create';
		this.data.url 		= window.location.pathname;
		this.data.country 	= this.countries;
		
		var post = controller.getPost();
		
		if(post && post.length) {
			//query to hash
			this.data.user = $.queryToHash(post);
			
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
		
        next();
    };
    
    var _output = function(next) {
		//store form templates path to array
        var templates = [
        'text!' + controller.path('user/template') +  '/form.html',
        'text!' + controller.path('user/template') +  '/form/basic.html',
        'text!' + controller.path('user/template') +  '/form/company.html',
        'text!' + controller.path('user/template') +  '/form/contact.html',
        'text!' + controller.path('user/template') +  '/form/picture.html',
        'text!' + controller.path('user/template') +  '/form/required.html',
        'text!' + controller.path('user/template') +  '/form/tabs.html',
        'text!' + controller.path('user/template') +  '/form/social.html'];

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
				.setTitle(this.title)
				.setHeader(this.header)
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);            
				
			next();
		}.bind(this));
    };

    var _listen = function(next) {
	   	$('section.user-profile form.package-user-form input[name="name"]').keyup(function(e) {
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
		if(!this.data.user.name || !this.data.user.name.length) {
			this.data.errors.name = { message: 'User cannot be empty.'};
		}
		
		if(!this.data.user.slug || !this.data.user.slug.length) {
			this.data.errors.slug = { message: 'Username cannot be empty.'};
		}
		
		if(!this.data.user.email || !this.data.user.email.length) {
			this.data.errors.email = { message: 'Email cannot be empty.'};
		}
		
		if(this.data.user.password 
		&& this.data.user.password.length
		&& (!this.data.user.confirm 
		|| !this.data.user.confirm.length)) {
			this.data.errors.confirm = { message: 'You must confirm your password.'};
		}
		
		if(this.data.user.password 
		&& this.data.user.password.length
		&& this.data.user.confirm 
		&& this.data.user.confirm.length
		&& this.data.user.password != this.data.user.confirm) {
			this.data.errors.confirm = { message: 'Password and confirm do not match.'};
		}
		
		//if we have no errors
		return JSON.stringify(this.data.errors) == '{}';
	};
	
	var _process = function(next) {
		var url = controller.getServerUrl() + '/user/create';
		
		//don't store the confirm
		delete this.data.user.confirm;
		
		//save data to database
		$.post(url, this.data.user, function(response) {
			response = JSON.parse(response);
			
			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', 'User successfully created!', 'success')
					//go to listing
					.redirect('/user');
				
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