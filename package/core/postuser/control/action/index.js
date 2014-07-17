define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.data 	= {};
	public.template = controller.path('postuser/template') + '/index.html';

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
		this.data = {};
	};

	/* Public Methods
	-------------------------------*/
	public.render = function() {
		$.sequence()
			.setScope(this)
			.then(_output)
			.then(_listen);

		return this;
	};

	/* Private Methods
	-------------------------------*/
	var _output = function(next) {
		controller.listen('user-update-ready', function() {
			// let's double check if hash
			// is user address
			var hash = window.location.hash;

			// if hash is not user/post[etc..]
			if(hash.indexOf('user/post') !== 1) {
				// just do nothing let
				// the default user profile
				// be rendered
				return;
			}

			require(['text!' + public.template], function(template) {
				var body = Handlebars.compile(template)(this.data);

				// get tab content target
				var target = $('div.tab-content');
				// append html
				target.html(body);

				next();
			});
		});
	};

	var _listen = function(next) {
		next();
	};


	/* Adaptor
	-------------------------------*/
	return c; 
});