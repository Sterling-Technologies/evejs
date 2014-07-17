controller
// listen when the application is initialized
.listen('init', function() {
	// set the paths
	controller
		.path('postuser'			, controller.path('package') + '/core/postuser')
		.path('postuser/action'		, controller.path('package') + '/core/postuser/action')
		.path('postuser/template' 	, controller.path('package') + '/core/postuser/template');

})

// when a url request has been made
.listen('request', function() {
	var location = window.location.pathname;
	var tab 	 = $('li.post-tab');

	// if request is not user/update
	if(location.indexOf('/user/update') !== 0) {
		// just do nothing
		return;
	}

	// if request location is /user/update and
	// the address tab does not exists
	if(tab.length === 0) {
		var action = controller.path('postuser/action') + '/tab.js';

		// render address tab
		require([action], function(tab) {
			tab.load().render();
		});

		return;
	}
})

// when a url request has been made
.listen('request', function() {
	// catch up user update request
	var location 	= window.location.pathname;
	var hash 	 	= window.location.hash;

	var action = null;

	switch(true) {
		case location.indexOf('/user/update') === 0 && hash === '#user/post' :
			action = 'index';
			break;
		case location.indexOf('/post/create') === 0 :
			action = 'create';
			break;
		case location.indexOf('/post/update') === 0 :
			action = 'update';
			break;
	}

	if(action === null && hash.indexOf('user/post') !== 1) {
		return;
	}

	// load up addressuser action
	action = controller.path('postuser/action') + '/' + action + '.js';

	require([action], function(action) {
		action.load().render();
	});
});
