controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('notification'			, controller.path('package') + '/core/notification')
		.path('notification/action'		, controller.path('package') + '/core/notification/action')
		.path('notification/asset'		, controller.path('package') + '/core/notification/asset')
		.path('notification/template'	, controller.path('package') + '/core/notification/template');
})

//when a url request has been made
.listen('request', function() {
	//if it doesn't start with notification
	if(window.location.pathname.indexOf('/notification') !== 0) {
		return;
	}
	
	//router -> action
	var action = controller.path('notification/action') + '/index.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});
})

// when a url request has been made
.listen('request', function() {
	// notification nav
	var navigation = controller.path('notification/action') + '/nav.js';

	// load up notification on
	// navigation
	require([navigation], function(nav) {
		nav.load().render();
	});
})

// when a url request has been made
.listen('request', function() {

});