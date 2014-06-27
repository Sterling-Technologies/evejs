controller
//when the application is initialized
.listen('init', function() {
	//comment test 2
	//set paths
	controller
		.path('oauth'			, controller.path('package') + '/core/oauth')
		.path('oauth/action'	, controller.path('package') + '/core/oauth/action')
		.path('oauth/asset'		, controller.path('package') + '/core/oauth/asset')
		.path('oauth/template'	, controller.path('package') + '/core/oauth/template');
})

//when a url request has been made
.listen('request', function() {
	//router -> action
	var action = 'validation';

	// If request does not start with oauth
	if(window.location.pathname.indexOf('/oauth') !== 0) {
	   	// Route request to validation
		return;
	}
	
	switch(true) {
		
	}
	
	action = controller.path('oauth/action') + '/' + action + '.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});
});