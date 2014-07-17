controller
// listen when the application is initialized
.listen('init', function() {
	// set the paths
	controller
		.path('addressuser'				, controller.path('package') + '/core/addressuser')
		.path('addressuser/action'		, controller.path('package') + '/core/addressuser/action')
		.path('addressuser/template'	, controller.path('package') + '/core/addressuser/template');

})
// when a url request has been made
.listen('request', function() {
	// cache post index
	var userIndex 		 = window.location.pathname.indexOf('/user'),
		userAddressIndex = window.location.pathname.indexOf('/user/address/'),
		userUpdateIndex  = window.location.pathname.indexOf('/user/update/');

	// if it doesn't start with user
	if(userIndex !== 0) {
		// this class doesn't care about it
		return;
	}

	var action = 'index';
	switch(true) {
		case userUpdateIndex === 0:
			action = 'update';
			break;
		case userAddressIndex === 0:
			action = 'address';
			break;
	}

	action = controller.path('addressuser/action') + '/' + action + '.js';

	//load up the action
	require([action], function(action) {
		action.load().render();
	});
})
