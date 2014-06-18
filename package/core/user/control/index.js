controller
//when the application is initialized
.listen('init', function() {
	//comment test 2
	//set paths
	controller
		.path('user'			, controller.path('package') + '/core/user')
		.path('user/action'		, controller.path('package') + '/core/user/action')
		.path('user/asset'		, controller.path('package') + '/core/user/asset')
		.path('user/template'	, controller.path('package') + '/core/user/template');
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	//add our menu item
	menu.push({
		path	: '/user',
		icon	: 'user',
		label	: 'Users',
		children: [{
			path	: '/user/create',
			label	: 'Create User' }]
		});
})
//when a url request has been made
.listen('request', function() {
	//if it doesn't start with user
	if(window.location.pathname.indexOf('/user') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var action = 'index';
	switch(true) {
		case window.location.pathname.indexOf('/user/create') === 0:
			action = 'create';
			break;
		case window.location.pathname.indexOf('/user/update') === 0:
			action = 'update';
			break;
		case window.location.pathname.indexOf('/user/remove') === 0:
			action = 'remove';
			break;
		case window.location.pathname.indexOf('/user/restore') === 0:
			action = 'restore';
			break;
		case window.location.pathname.indexOf('/user/bulk') === 0:
			action = 'bulk';
			break;
	}
	
	action = controller.path('user/action') + '/' + action + '.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});
});