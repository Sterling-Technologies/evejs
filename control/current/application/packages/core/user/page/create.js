define(function() {
	var c = function() {}, public = c.prototype;
	
	/* Public Properties 
	-------------------------------*/
	public.title 		= 'Create User';
	public.header 		= 'Create User';
	public.subheader 	= 'CRM';
	public.crumbs 		= [{ 
		path: '/user',
		icon: 'user', 
		label: 'Users' 
	}, {  label: 'Create User' }];
	
	public.data 	= {};
	public.template = controller.path('user/template') + '/form.html';
	
	/* Private Properties
	-------------------------------*/
	var $ 		= jQuery;
	var _api 	= 'http://api.lbc.dev:8082/user';
	
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
		$.sequence().setScope(this)
		.then(this.getData)
		.then(this.output);
		
		return this;
	};
	
	public.getData = function(callback) {
		callback();
		
		var self = this,
        forms = [
        controller.path('config') + '/countries.js',
        'text!' + controller.path('user/template') +  'form/tabs.html',
        'text!' + controller.path('user/template') +  'form/picture.html',
        'text!' + controller.path('user/template') +  'form/basic.html',
        'text!' + controller.path('user/template') +  'form/contact.html',
        'text!' + controller.path('user/template') +  'form/social.html',
        'text!' + controller.path('user/template') +  'form/required.html',
        'text!' + controller.path('user/template') +  'form/company.html'];

        require(forms, function(countries, tabs, picture, basic, contact, social, required, company) {
            
            //load basic form template
            basic = Handlebars.compile(basic)({});

            //load company form template
            company = Handlebars.compile(company)({
                user_company         : 'example company',
                user_job_title       : 'example job title',
                user_company_street  : 'example street',
                user_company_city    : 'example city',
                user_company_state   : 'example state',
                //We need an array for country code and country name
                //lets create an array inside company and store all country data on it
                country              : countries,
                user_company_postal  : '4012',
                user_company_phone   : '(000)-000-0000',
                company_email        : 'email@example.com'
            });

            //load contact form template
            contact = Handlebars.compile(contact)({
                user_website  : 'www.example.com',
                user_phone    : '09298888888'
            });
            
            //load picture form template
            picture = Handlebars.compile(picture)({
                user_photo : 'example.jpg'
            });

            //load required form template
            required = Handlebars.compile(required)({
                user_name       : 'example username',
                user_slug       : 'example slug',
                user_email      : 'email@example.com',
                user_password   : 'example password',
                user_confirm    : 'example confirm',
                errors : {
                    user_name       : '',
                    user_slug       : '',
                    user_email      : '',
                    user_password   : '',
                    user_confirm    : ''
                }
            });

            //load social form template
            social = Handlebars.compile(social)({
                user_facebook : 'user facebook',
                user_twitter  : 'user twitter',
                user_google   : 'user google'
            });

            //load tabs template
            tabs = Handlebars.compile(tabs)({
                request_uri : '',
                path        : 'example/path',
                id          : 'example_id',
                tabs        : [{
                    item : {
                        icon    : 'example.icon',
                        label   : 'example label'
                    }
                }]
            });

            //append form templates to page
        	self.data.tabs = Handlebars.compile(tabs);
        	self.data.picture = Handlebars.compile(picture);
        	self.data.basic = Handlebars.compile(basic);
        	self.data.contact = Handlebars.compile(contact);
        	self.data.social = Handlebars.compile(social);
        	self.data.required = Handlebars.compile(required);
        	self.data.company = Handlebars.compile(company);
        });

		return this;
	};
	
	public.output = function(callback) {
        var self = this;
   
        controller
        .setTitle(this.title)
        .setHeader(this.header)
        .setSubheader(this.subheader)
        .setCrumbs(this.crumbs)
        .setBody(self.template, self.data);
        $('#body').on('submit', 'form.package-user-form', { scope: self }, _process);               
        callback();    
        
        return this;
    };
	
	/* Private Methods
	-------------------------------*/
	var _process = function(e) {
		e.preventDefault();
		console.log(this, e.data.scope.title);
	};
	
	/* Adaptor
	-------------------------------*/
	return c.load(); 
});