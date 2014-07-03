controller
//when the application is initialized
.listen('init', function() {
	//comment test 2
	//set paths
	controller
		.path('auth'			, controller.path('package') + '/core/auth')
		.path('auth/action'		, controller.path('package') + '/core/auth/action')
		.path('auth/asset'		, controller.path('package') + '/core/auth/asset')
		.path('auth/template'	, controller.path('package') + '/core/auth/template');
})

//when a url request has been made
.listen('request', function() {
	//if it doesn't start with user
	if(window.location.pathname.indexOf('/login') !== 0) {
		// we need to validate if user session
		// exists, else we need to redirect user
		// back to login page.
		var session = $.cookie('__acc');

		// If session is undefined
		if(session === undefined) {
			// Redirect back to login page
			return controller.redirect('/login')
		}

		return;
	}
	
	//router -> action
	var action = controller.path('auth/action') + '/index.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});
})

// when a url request has been made
.listen('request', function() {
	var navigation = controller.path('auth/action') + '/nav.js';

	// load up navigation for user
	require([navigation], function(nav) {
		nav.load().render();
	});
})

// when a url request has been made;
.listen('request', function() {
	// modify url to dynamically
	// add access token in every
	// server request.
	$.ajaxPrefilter(function(options, original, jqxhr) {
		// Get Requested url
		var url  	= original.url;

		// If requested url is auth
		if(url.indexOf('/auth') == 0 || url.indexOf('/auth/') == 0) {
			// There's no need to modify
			// the request.
			return;
		}

		// Protocol Index
		var http 	= url.indexOf('//');

		// Path Index
		var pathidx = (url.indexOf('/', http + 2) !== -1) ?
					   url.indexOf('/', http + 2) : 
					   url.length;

		// Request Protocol
		var protocol = url.substring(0, (http - 1));
		// Request Domain
		var domain   = url.substring(http + 2, pathidx);
		// Request Path
		var path 	 = url.substring(pathidx);
		// Server Url
		var server = controller.getServerUrl();
		// Target Url
		var target = protocol + '://' + domain;

		// We will only need to modify
		// app server request, other request
		// will no need to be modified
		if(server == target) {
			// Get user session
			var session = $.cookie('__acc');

			// If session is not defined
			if(session === undefined) {
				// Do nothing
				return;
			}

			// Parse session
			session = JSON.parse(session);

			// Get the access token
			var token = session.token;

			// If ? exists in url append
			// access token as &access_token
			if(path.indexOf('?') !== -1) {
				// Append Access token at the end
				// using &
				options.url = protocol + '://' + domain +
							  path + '&access_token=' + token;
			
				return;
			}
			
			// Append Access token using ?
			options.url = protocol + '://' + domain +
						  path + '?access_token=' + token;

			return;
		}
	});
});