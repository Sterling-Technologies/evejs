controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('address'			, controller.path('package') + '/core/address')
		.path('address/action'		, controller.path('package') + '/core/address/action')
		.path('address/asset'		, controller.path('package') + '/core/address/asset')
		.path('address/template'	, controller.path('package') + '/core/address/template');
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	//add our menu item
	menu.push({
		path	: '/address',
		icon	: 'home',
		label	: 'Address',
		children: [{
			path	: '/address/create',
			label	: 'Create address' }]
		});
})
//when a url request has been made
.listen('request', function() {
	//if it doesn't start with address
	if(window.location.pathname.indexOf('/address') !== 0) {
		//we don't care about it
		return;
	}

	//router -> action
	var action = 'index';
	switch(true) {
		case window.location.pathname.indexOf('/address/create') === 0:
			action = 'create';
			break;
		case window.location.pathname.indexOf('/address/update') === 0:
			action = 'update';
			break;
		case window.location.pathname.indexOf('/address/remove') === 0:
			action = 'remove';
			break;
		case window.location.pathname.indexOf('/address/restore') === 0:
			action = 'restore';
			break;
		case window.location.pathname.indexOf('/address/bulk') === 0:
			action = 'bulk';
			break;
	}
	
	action = controller.path('address/action') + '/' + action + '.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});

});