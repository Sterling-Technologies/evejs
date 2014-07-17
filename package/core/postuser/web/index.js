controller
// listen when the application is initialized
.listen('init', function() {
	// set the paths
	controller
		.path('postuser'			, controller.path('package') + '/core/postuser')
		.path('postuser/action'		, controller.path('package') + '/core/postuser/action');

})
// when a url request has been made
.listen('request', function() {
	// cache post index
	var postIndex 		 = window.location.pathname.indexOf('/user/update/'),
		postCreateIndex  = window.location.pathname.indexOf('/post/create'),
		postUpdateIndex = window.location.pathname.indexOf('/post/update');

	// if it doesn't start with post and user
	if(window.location.pathname.indexOf('/post') !== 0) {
		// this class doesn't care about it
		return;
	}

	var action = 'index';
	switch(true) {
		case postCreateIndex == 0:
			action = 'create';
			break;
		case postUpdateIndex == 0:
			action = 'update';
			break;
		case postIndex == 0:
			action = 'index';
			break;
	}

	action = controller.path('postuser/action') + '/' + action + '.js';

	//load up the action
	require([action], function(action) {
		action.load().render();
	});
})
