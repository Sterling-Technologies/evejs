define(function() {
	var c = function() {}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.title 		= 'Create Users';
	
	public.data 	= {};
	public.template = controller.path('user/template') + '/index.html';
	
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
			.then(_setData)
			.then(_output);
		
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	var _setData = function(next) {
		next();
		return this;
	};
	
	var _output = function(next) {
		//bulk load the templates
		require(['text!' + this.template], function(template) {
			var body = Handlebars.compile(template)(this.data);
			
			controller
				.setTitle(this.title)
				.setBody(body);
			
			next();
		}.bind(this));
	};
	
	/* Adaptor
	-------------------------------*/
	return c.load(); 
});