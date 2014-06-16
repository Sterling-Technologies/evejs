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
    
	public.tabs = [{
		item 		: {
			icon 	: 'example.icon',
			label 	: 'example label'
		}
	}];
	
	public.errors = {
		user_name       : '',
		user_slug       : '',
		user_email      : '',
		user_password   : '',
		user_confirm    : ''
	};
	
    public.data     = {};
    public.template = controller.path('user/template') + '/form.html';
    
    /* Private Properties
    -------------------------------*/
    var $       	= jQuery;
    var _listening 	= false;
    
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
    _setData = function(next) {
		this.data = {
			user	: {
				id 					: 'example_id',
				user_birthdate 		: '',
            	user_gender    		: 'male',
				user_company        : 'example company',
				user_job_title      : 'example job title',
				user_company_street : 'example street',
				user_company_city   : 'example city',
				user_company_state  : 'example state',
				user_company_postal : '4012',
				user_company_phone  : '(000)-000-0000',
				company_email       : 'email@example.com',
				user_website  		: 'http://www.web-example.com',
            	user_phone    		: '09298888888',
				user_photo 			: 'example.jpg',
				user_name       	: 'example username',
				user_slug       	: 'example slug',
				user_email      	: 'email@example.com',
				user_password   	: 'example password',
				user_confirm    	: 'example confirm',
				user_facebook 		: 'user facebook',
				user_twitter  		: 'user twitter',
				user_google   		: 'user google'
			},
			
			request_uri : '',
			path 		: 'example/path',
			country     : this.countries,
			tabs 		: this.tabs,
			errors 		: this.errors
		};
		

        next();
    };
    
    var _output = function(next) {
        var self = this;
		
		//store form templates path to array
        var templates = [
        'text!' + controller.path('user/template') +  'form/basic.html',
        'text!' + controller.path('user/template') +  'form/company.html',
        'text!' + controller.path('user/template') +  'form/contact.html',
        'text!' + controller.path('user/template') +  'form/picture.html',
        'text!' + controller.path('user/template') +  'form/required.html',
        'text!' + controller.path('user/template') +  'form/tabs.html',
        'text!' + controller.path('user/template') +  'form/social.html'];

        //require form templates
        //assign it to main form
        require(templates, function(basic, company, 
		contact, picture, required, tabs, social) {

            //load basic form template 
            self.data.basic = Handlebars.compile(basic)(self.data);

            //load company form template
            self.data.company = Handlebars.compile(company)(self.data);

            //load contact form template
            self.data.contact = Handlebars.compile(contact)(self.data);
            
            //load picture form template
            self.data.picture = Handlebars.compile(picture)(self.data);

            //load required form template
            self.data.required = Handlebars.compile(required)(self.data);

            //load tabs template
            self.data.tabs = Handlebars.compile(tabs)(self.data);

            //load social form template
            self.data.social = Handlebars.compile(social)(self.data);
        
			controller
				.setTitle(self.title)
				.setHeader(self.header)
				.setSubheader(self.subheader)
				.setCrumbs(self.crumbs)
				.setBody(self.template, self.data);            
			
			next();
		});
    };

    var _listen = function(next) {
        // if we are listening, we cant send data
        if(_listening) {
            next();
            return this;
        }
        
        //if not listening, submit form
        $('#body').on('submit', 'form.package-user-form', { scope: self }, function(e) {
			//prevent page from reloading
			e.preventDefault();
			
			_process();
		});  
		             
        //set listening to true
        _listening = true;
       
	    next();
    };
	
	var _process = function() {	
		//prepare form data
		var data 	= $('form.package-user-form').serialize(),
			url 	= controller.getServerUrl() + '/user/create';
		
		//save data to database
		$.post(url, data, function(response) {
			//display message status
			controller.addMessage('Record successfully saved!');
	   });
	};
	
	var _setCountries = function(callback) {
		var self = this;
		require([controller.path('config') + '/countries.js'], function(countries) {
			self.countries = countries;
			callback();
		});
	};
    
    /* Adaptor
    -------------------------------*/
    return c.load(); 
});