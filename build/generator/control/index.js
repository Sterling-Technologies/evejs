controller
//when the application is initialized
.listen('init', function() {
	//comment test 2
	//set paths
	controller
		.path('sample'			, controller.path('package') + '/example/sample')
		.path('sample/action'		, controller.path('package') + '/example/sample/action')
		.path('sample/asset'		, controller.path('package') + '/example/sample/asset')
		.path('sample/template'	, controller.path('package') + '/example/sample/template');

	// fire event when the sample was initialized
	controller.trigger('sample-init');
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	// fire event when the sample menu is starting
	controller.trigger('sample-menu-before');

	//add our menu item
	menu.push({
		path	: '/sample',
		icon	: 'pencil',
		label	: 'Samples',
		children: [{
			path	: '/sample/create',
			label	: 'Create sample' }]
		});

	// fire event when the sample menu is finished
	controller.trigger('sample-menu-after');
})
//when a url request has been made
.listen('request', function() {
	// fire event when the sample request is starting
	controller.trigger('sample-request-before');

	//if it doesn't start with sample
	if(window.location.pathname.indexOf('/sample') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var action = 'index';
	switch(true) {
		case window.location.pathname.indexOf('/sample/create') === 0:
			action = 'create';
			break;
		case window.location.pathname.indexOf('/sample/update') === 0:
			action = 'update';
			break;
		case window.location.pathname.indexOf('/sample/remove') === 0:
			action = 'remove';
			break;
		case window.location.pathname.indexOf('/sample/restore') === 0:
			action = 'restore';
			break;
		case window.location.pathname.indexOf('/sample/bulk') === 0:
			action = 'bulk';
			break;
	}
	
	action = controller.path('sample/action') + '/' + action + '.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});

	// fire event when the sample request is finished
	controller.trigger('sample-request-after');
});