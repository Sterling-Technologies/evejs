define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.title 		= 'Notification';
	public.template 	= controller.path('notification/template') + '/index.html';
	
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
	public.loadAssets = function(callback) {
		//make sure callback is a function
		callback = callback || $.noop;
		
		//if loaded
		if(_loaded) {
			//do nothing
			callback();
			return this;
		}
		
		//add the style to header
		//<link rel="stylesheet" type="text/css" href="/styles/autocomplete.css" />
		$('<link rel="stylesheet" type="text/css" />')
			.attr('href', controller.path('notification/asset') + '/index.css')
			.appendTo('head');
		
		_loaded = true;
		
		callback();
		
		return this;
	};

	public.render = function() {
		$.sequence()
			.setScope(this)
			.then(this.loadAssets)
			.then(_output)
			.then(_listen);
		
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	var _output = function(next) {
		//bulk load the templates
		require(['text!' + this.template], function(template) {
			//render the body
			var body = Handlebars.compile(template)(this.data);
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