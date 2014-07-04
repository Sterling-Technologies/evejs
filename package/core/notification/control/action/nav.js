define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.template 	= controller.path('notification/template') + '/nav.html';
	
	public.data = {};

	/* Private Properties
	-------------------------------*/
	var $ = jQuery;
	
	var _loaded = false;

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
		next();
	};

	var _output = function(next) {
		//bulk load the templates
		require(['text!' + this.template], function(template) {
			//render the body
			var body = Handlebars.compile(template)(this.data);

			// Check if nav already exist
			var nav = $('ul.nav.ace-nav').find('li.nav-notification');

			// If nav does not exists
			if(nav.length == 0) {
				// Inject user nav into right nav
				$('ul.nav.ace-nav').prepend(body);
			}

			next();
		}.bind(this));
	};
	
	var _listen = function(next) {
		next();
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});