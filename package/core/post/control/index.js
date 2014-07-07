controller
//when the application is initialized
.listen('init', function() {
	//comment test 2
	//set paths
	controller
		.path('post'			, controller.path('package') + '/core/post')
		.path('post/action'		, controller.path('package') + '/core/post/action')
		.path('post/asset'		, controller.path('package') + '/core/post/asset')
		.path('post/template'	, controller.path('package') + '/core/post/template');

	// fire event when the post was initialized
	controller.trigger('post-init');
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	// fire event when the post menu is starting
	controller.trigger('post-menu-before');

	//add our menu item
	menu.push({
		path	: '/post',
		icon	: 'pencil',
		label	: 'Posts',
		children: [{
			path	: '/post/create',
			label	: 'Create Post' }]
		});

	// fire event when the post menu is finished
	controller.trigger('post-menu-after');
})
//when a url request has been made
.listen('request', function() {
	// fire event when the post request is starting
	controller.trigger('post-request-before');

	//if it doesn't start with post
	if(window.location.pathname.indexOf('/post') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var action = 'index';
	switch(true) {
		case window.location.pathname.indexOf('/post/create') === 0:
			action = 'create';
			break;
		case window.location.pathname.indexOf('/post/update') === 0:
			action = 'update';
			break;
		case window.location.pathname.indexOf('/post/remove') === 0:
			action = 'remove';
			break;
		case window.location.pathname.indexOf('/post/restore') === 0:
			action = 'restore';
			break;
		case window.location.pathname.indexOf('/post/bulk') === 0:
			action = 'bulk';
			break;
	}
	
	action = controller.path('post/action') + '/' + action + '.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});

	// fire event when the post request is finished
	controller.trigger('post-request-after');
});