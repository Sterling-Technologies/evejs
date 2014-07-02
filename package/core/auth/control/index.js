controller
//when the application is initialized
.listen('init', function() {
	//comment test 2
	//set paths
	controller
		.path('login'			, controller.path('package') + '/core/login')
		.path('login/action'	, controller.path('package') + '/core/login/action')
		.path('login/asset'		, controller.path('package') + '/core/login/asset')
		.path('login/template'	, controller.path('package') + '/core/login/template');
})

//when a url request has been made
.listen('request', function() {
	//if it doesn't start with user
	if(window.location.pathname.indexOf('/login') !== 0) {
		// $.removeCookie('__acctoken');
		// we need to validate if user session
		// exists, else we need to redirect user
		// back to login page.
		var token = $.cookie('__acctoken');
		
		if(token === undefined) {
			window.history.pushState({}, '', '/login');
		}

		return;
	}
	
	//router -> action
	var action = controller.path('login/action') + '/index.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});
});