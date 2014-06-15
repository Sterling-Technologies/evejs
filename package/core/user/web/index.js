controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('user'			, controller.path('package') + '/core/user/')
		.path('user/action'		, controller.path('package') + '/core/user/action/')
		.path('user/template'	, controller.path('package') + '/core/user/template/');
})
//when a url request has been made
.listen('request', function() {
	//if it doesn't start with user
	if(window.location.pathname.indexOf('/user') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var page = 'index';
	switch(window.location.pathname) {
		case '/user/create':
			page = 'create';
			break;
	}
	
	action = controller.path('user/action') + page + '.js';
	
	//load up the action
	require([action], function(action) {
		action.render();
	});
});