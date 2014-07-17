define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.data 	= {};
	public.template = controller.path('postuser/template') + '/tab.html';

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
	var _setData = function(next) {

	};

	var _output = function(next) {
		controller.listen('user-update-ready', function() {
			require(['text!' + public.template], function(body) {
				// get tab container
				var target = $('ul.nav.nav-tabs');
				
				// check if tab exists
				if($('li.post-tab').length === 0) {
					// append address tab to tabs
					target.append(body);
				}

				// get hash
				var hash = window.location.hash;
				// if has is user/address
				if(hash.indexOf('user/post') === 1) {
					// clear active tabs first
					target.find('li').removeClass('active');
					// make address tab active
					target.find('li.post-tab').addClass('active');
				}

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