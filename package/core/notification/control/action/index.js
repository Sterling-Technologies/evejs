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

//when the application is initialized
.listen('init', function() {
	// auto generated socket.io module
	var socket = controller.getServerUrl() + '/socket.io/socket.io.js';

	// socket.io module must be loaded this
	// way, there is no way to include it
	// in client side, it must be fetch
	// from the socket io server
	if(!window.io) {
		// require socket.io module
		require([socket], function(socket) {
			// expose socket io globally
			window.io = socket;
		});
	}
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
});