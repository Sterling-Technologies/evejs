define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.title 		= 'Login';
	public.template 	= controller.path('auth/template') + '/index.html';
	
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
			.attr('href', controller.path('auth/asset') + '/index.css')
			.appendTo('head');
		
		_loaded = true;
		
		callback();
		
		return this;
	};

	public.render = function() {
		$.sequence()
			.setScope(this)
			.then(_checkSession)
			.then(this.loadAssets)
			.then(_output)
			.then(_listen);
		
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	var _checkSession = function(next) {
		// Get account token
		var token = $.cookie('__acctoken');

		// If token is undefined
		if(token !== undefined) {
			// Redirect user back to login
			// page
			return window.history.pushState({}, '', '/');
		}

		next();
	};

	var _output = function(next) {
		//bulk load the templates
		require(['text!' + this.template], function(template) {
			//render the body
			var body = Handlebars.compile(template)(this.data);
			
			// We just need to set out the title
			controller.setTitle(this.title);
			// Set body class to login layout
			$(document.body).attr('class', 'login-layout');
			// then replace the whole body
			// with our login template
			$(document.body).html(body);

			next();
		}.bind(this));
	};

	var _valid = function() {
		var username = $('label#username input'),
			password = $('label#password input'),
			valid    = true;

		if(username.val().length == 0) {
			_setError('username');
			valid = false;
		}

		if(password.val().length == 0) {
			_setError('password');
			valid = false;
		}

		return valid;
	};

	var _setError = function(field) {
		if(field == 'username') {
			$('label#username').addClass('has-error');
			return;
		}

		if(field == 'password') {
			$('label#password').addClass('has-error');
			return;
		}
	};
	
	var _listen = function(next) {
		// On login form submit
		$('form#loginForm').on('submit', function(e) {
			e.preventDefault();

			// validate form
			if(!_valid()) {
				controller.notify('Error', 'Invalid Username or Password', 'error');
				return false;
			}

			// Serialize Data
			var data  = $(this).serialize();
			// Login Endpoint
			var login = controller.getServerUrl() + '/auth';

			$.post(login, data, function(response) {
				// If there is an error
				if(response.error) {
					// Set Field error
					_setError('username'), _setError('password');
					// Notify that there is an error
					controller.notify('Error', response.message, 'error');
					return;
				}

				// Set response token as cookie
				$.cookie('__acctoken', response.results.token, { path : '/', expires : 1 });

				// Redirect to home page
				window.location.href = '/';
			}.bind(this), 'json');
		});

		next();
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});