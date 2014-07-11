controller
//when the application is initialized
.listen('init', function() {
	//comment test 2
	//set paths
	controller
		.path('{SLUG}'			, controller.path('package') + '/{VENDOR}/{SLUG}')
		.path('{SLUG}/action'		, controller.path('package') + '/{VENDOR}/{SLUG}/action')
		.path('{SLUG}/asset'		, controller.path('package') + '/{VENDOR}/{SLUG}/asset')
		.path('{SLUG}/template'	, controller.path('package') + '/{VENDOR}/{SLUG}/template');

	// fire event when the {SLUG} was initialized
	controller.trigger('{SLUG}-init');
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	// fire event when the {SLUG} menu is starting
	controller.trigger('{SLUG}-menu-before');

	//add our menu item
	menu.push({
		path	: '/{SLUG}',
		icon	: 'pencil',
		label	: '{PLURAL}',
		children: [{
			path	: '/{SLUG}/create',
			label	: 'Create {SLUG}' }]
		});

	// fire event when the {SLUG} menu is finished
	controller.trigger('{SLUG}-menu-after');
})
//when a url request has been made
.listen('request', function() {
	// fire event when the {SLUG} request is starting
	controller.trigger('{SLUG}-request-before');

	//if it doesn't start with {SLUG}
	if(window.location.pathname.indexOf('/{SLUG}') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var action = 'index';
	switch(true) {
		case window.location.pathname.indexOf('/{SLUG}/create') === 0:
			action = 'create';
			break;
		case window.location.pathname.indexOf('/{SLUG}/update') === 0:
			action = 'update';
			break;
		case window.location.pathname.indexOf('/{SLUG}/remove') === 0:
			action = 'remove';
			break;
		case window.location.pathname.indexOf('/{SLUG}/restore') === 0:
			action = 'restore';
			break;
		case window.location.pathname.indexOf('/{SLUG}/bulk') === 0:
			action = 'bulk';
			break;
	}
	
	action = controller.path('{SLUG}/action') + '/' + action + '.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});

	// fire event when the {SLUG} request is finished
	controller.trigger('{SLUG}-request-after');
});