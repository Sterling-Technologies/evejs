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
		var token = $.cookie('__acctoken');
		
		// If token is undefined
		if(token === undefined) {
			// Redirect back to login page
			window.history.pushState({}, '', '/login');
		}

		return;
	}
	
	//router -> action
	var action = controller.path('auth/action') + '/index.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});
});