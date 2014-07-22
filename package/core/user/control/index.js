controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('user'			, controller.path('package') + '/core/user')
		.path('user/action'		, controller.path('package') + '/core/user/action')
		.path('user/asset'		, controller.path('package') + '/core/user/asset')
		.path('user/template'	, controller.path('package') + '/core/user/template');

	controller.trigger('user-init');
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	// event when the user menu is starting
	controller.trigger('user-menu-before');

	//add our menu item
	menu.push({
		path	: '/user',
		icon	: 'user',
		label	: 'Users',
		children: [{
			path	: '/user/create',
			label	: 'Create User' }]
		});

	// event when the user menu is finished
	controller.trigger('user-menu-after');
})
//when a url request has been made
.listen('request', function() {
	//event when the user request is starting
	controller.trigger('user-request-before');

	//if it doesn't start with user
	if(window.location.pathname.indexOf('/user') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var route = { action: null };
	switch(true) {
		case window.location.pathname.indexOf('/user/create') === 0:
			route.action = 'create';
			break;
		case window.location.pathname.indexOf('/user/update') === 0:
			route.action = 'update';
			break;
		case window.location.pathname.indexOf('/user/remove') === 0:
			route.action = 'remove';
			break;
		case window.location.pathname.indexOf('/user/restore') === 0:
			route.action = 'restore';
			break;
		case window.location.pathname.indexOf('/user/bulk') === 0:
			route.action = 'bulk';
			break;
		case window.location.pathname === '/user':
			route.action = 'index';
			break;
	}

	// if there is no route
	if(!route.action) {
		// just do nothing
		return;
	}
	
	route.path = controller.path('user/action') + '/' + route.action + '.js';
	
	//event when the user action is about to render
	controller.trigger('user-action-' + route.action + '-before', route);
	
	//load up the action
	require([route.path], function(action) {
		action.load().render();
		
		//event when the user action is rendered
		controller.trigger('user-action-' + route.action + '-after', route);
	});

	// event when the user request is finished
	controller.trigger('user-request-after');
})

// when body is fully loaded
.listen('body', function() {
	var url = window.location.pathname;
	var id  = controller.getUrlSegment(-1);

	// if tab is already rendered
	if(jQuery('section.user-update ul.nav-tabs li.user-profile-tab').length !== 0) {
		// just do nothing
		return;
	}

	require(['text!' + controller.path('user/template') + '/form/tabs.html'], function(html) {
		html = Handlebars.compile(html)({ id : id, url : url });
		jQuery('section.user-update ul.nav.nav-tabs').prepend(html)
	});
});