define(function() {
    var c = function() {}, public = c.prototype;
    
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
	public.errors 	= {};
	
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
		var post = controller.getPost();
		console.log(post);
		this.data.mode 		= 'create';
		this.data.url 		= window.location.href.split('?')[0];
		this.data.country 	= this.countries;
		this.data.errors 	= this.errors;
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
        /*//if not listening, submit form
        $('section.user-profile form.package-user-form').one('submit', function(e) {
			if(!_valid.call(this)) {			
				//display message status
				controller.addMessage('There was an error in the form.', 'danger', 'exclamation-sign');
				
				//let the refresh happen
				return;
			}
			
			_process.call(this);
		}.bind(this));  */
       
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
		var form 	= $('section.user-profile form.package-user-form'),
			data 	= form.serialize();
		
		//remember the data
		this.data.user = $.queryToHash(data);
		
		//clear errors
		this.errors = {};
		
		//local validate
		if(!$('input[name="name"]', form).val().length) {
			this.errors.name = { message: 'User cannot be empty.'};
		}
		
		if(!$('input[name="slug"]', form).val().length) {
			this.errors.slug = { message: 'Username cannot be empty.'};
		}
		
		if(!$('input[name="email"]', form).val().length) {
			this.errors.email = { message: 'Email cannot be empty.'};
		}
		
		if($('input[name="password"]', form).val().length 
		&& !$('input[name="confirm"]', form).val().length) {
			this.errors.confirm = { message: 'You must confirm your password.'};
		}
		
		if($('input[name="confirm"]', form).val().length
		&& $('input[name="password"]', form).val()
		!= $('input[name="confirm"]', form).val()) {
			this.errors.confirm = { message: 'Password and confirm do not match.'};
		}
		
		//if we have no errors
		return JSON.stringify(this.errors) == '{}';
	};
	
	var _process = function() {
		var form 	= $('section.user-profile form.package-user-form'),
			data 	= form.serialize(),
			url 	= controller.getServerUrl() + '/user/create';
			
		//save data to database
		$.post(url, data, function(response) {
			response = JSON.parse(response);
			
			if(!response.error) {					
				//display message status
				controller.addMessage('User successfully created!', 'success', 'check');
				//push the state
				window.history.pushState(data, '', '/user');
				
				return;
			}
			
			this.errors = response.validation || {};
			
			//push the state
			window.history.pushState(data, '', window.location.href);
			
			//display message status
			controller.addMessage('There was an error in the form.', 'danger', 'exclamation-sign');
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