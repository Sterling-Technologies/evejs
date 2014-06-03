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