controller
// listen when the application is initialized
.listen('init', function() {
	// set the paths
	controller
		.path('categorypost'			, controller.path('package') + '/core/categorypost')
		.path('categorypost/action'		, controller.path('package') + '/core/categorypost/action');

})
// when a url request has been made
.listen('request', function() {
	// cache post index
	var postIndex 		 = window.location.pathname.indexOf('/post'),
		postCreateIndex  = window.location.pathname.indexOf('/post/create'),
		postUpdateIndex = window.location.pathname.indexOf('/post/update');

	// if it doesn't start with category
	if(postIndex !== 0) {
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
	}

	action = controller.path('categorypost/action') + '/' + action + '.js';

	// //load up the action
	require([action], function(action) {
		action.load().render();
	});
})
