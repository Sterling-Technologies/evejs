define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.template 	= controller.path('auth/template') + '/nav.html';
	public.data = {};

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
		// Get user session
		var session = $.cookie('__acc');

		// if session is not defined
		if(session === undefined) {
			// force user to login
			return next();
		}

		// convert session to json object
		session = JSON.parse(session);

		// trim firstname
		var firstname = session.name.substring(0,
			session.name.indexOf(' '));

		// set user data
		this.data.user = {
			id 	  : session.id,
			name  : firstname,
			email : session.email,
			token : session.token
		};

		next();
	};

	var _output = function(next) {
		//bulk load the templates
		require(['text!' + this.template], function(template) {
			//render the body
			var body = Handlebars.compile(template)(this.data);

			// Check if nav already exist
			var nav = $('ul.nav.ace-nav').find('li.nav-user');

			// If nav does not exists
			if(nav.length == 0) {
				// Inject user nav into right nav
				$('ul.nav.ace-nav').append(body);
			}

			next();
		}.bind(this));
	};
	
	var _listen = function(next) {
		// Get exact reference of
		// the navigation
		var nav = $('ul.nav.ace-nav').find('li.nav-user');

		nav.find('a#logout').on('click', function(e) {
			e.preventDefault();

			// Get user session
			var session = $.cookie('__acc');
			
			// If token does not exist at all
			if(session === undefined) {
				return controller.redirect('/login');
			}
 
			// Logout endpoint
			var logout = controller.getServerUrl() + '/auth/logout';
			
			// Pass user id as post data
			session = JSON.parse(session);
			
			var data   = { id : session.id }; 

			// Send post request for logout
			$.post(logout, data, function(response) {
				if(response.error) {
					return controller.notify('Error', response.message, 'error');
				}

				// remove user session
				$.removeCookie('__acc');

				return controller.redirect('/login');
			}.bind(this), 'json');
		});

		next();
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});