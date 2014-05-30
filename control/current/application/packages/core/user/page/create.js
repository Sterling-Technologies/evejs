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
	public.template = controller.path('user/template') + '/index.html';
	
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
		controller
		.setTitle(this.title)
		.setHeader(this.header)
		.setSubheader(this.subheader)
		.setCrumbs(this.crumbs)
		.setBody(this.template, this.data);
		
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c.load(); 
});