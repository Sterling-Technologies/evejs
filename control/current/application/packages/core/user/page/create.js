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
        'text!' + controller.path('user/template') +  'form/tabs.html',
        'text!' + controller.path('user/template') +  'form/picture.html',
        'text!' + controller.path('user/template') +  'form/basic.html',
        'text!' + controller.path('user/template') +  'form/contact.html',
        'text!' + controller.path('user/template') +  'form/social.html',
        'text!' + controller.path('user/template') +  'form/required.html',
        'text!' + controller.path('user/template') +  'form/company.html'];

        require(forms, function(tabs, picture, basic, contact, social, required, company) {
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