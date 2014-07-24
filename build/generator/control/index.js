controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('{SLUG}'			, controller.path('package') + '/{VENDOR}/{SLUG}')
		.path('{SLUG}/action'	, controller.path('package') + '/{VENDOR}/{SLUG}/action')
		.path('{SLUG}/asset'	, controller.path('package') + '/{VENDOR}/{SLUG}/asset')
		.path('{SLUG}/template'	, controller.path('package') + '/{VENDOR}/{SLUG}/template');

	controller.trigger('{SLUG}-init');
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	// event when the {SLUG} menu is starting
	controller.trigger('{SLUG}-menu-before');

	//add our menu item
	menu.push({
		path	: '/{SLUG}',
		icon	: '{ICON}',
		label	: '{PLURAL}',
		children: [{
			path	: '/{SLUG}/create',
			label	: 'Create {SINGULAR}' }]
		});

	// event when the {SLUG} menu is finished
	controller.trigger('{SLUG}-menu-after');
})
//when a url request has been made
.listen('request', function() {
	//event when the {SLUG} request is starting
	controller.trigger('{SLUG}-request-before');

	//if it doesn't start with {SLUG}
	if(window.location.pathname.indexOf('/{SLUG}') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var route = { action: null };
	switch(true) {
		case window.location.pathname.indexOf('/{SLUG}/create') === 0:
			route.action = 'create';
			break;
		case window.location.pathname.indexOf('/{SLUG}/update') === 0:
			route.action = 'update';
			break;
		case window.location.pathname.indexOf('/{SLUG}/remove') === 0:
			route.action = 'remove';
			break;
		case window.location.pathname.indexOf('/{SLUG}/restore') === 0:
			route.action = 'restore';
			break;
		case window.location.pathname.indexOf('/{SLUG}/bulk') === 0:
			route.action = 'bulk';
			break;
		case window.location.pathname === '/{SLUG}':
			route.action = 'index';
			break;
	}

	// if there is no route
	if(!route.action) {
		// just do nothing
		return;
	}
	
	route.path = controller.path('{SLUG}/action') + '/' + route.action + '.js';
	
	//event when the {SLUG} action is about to render
	controller.trigger('{SLUG}-action-' + route.action + '-before', route);
	
	//load up the action
	require([route.path], function(action) {
		action.load().render();
		
		//event when the {SLUG} action is rendered
		controller.trigger('{SLUG}-action-' + route.action + '-after', route);
	});

	// event when the {SLUG} request is finished
	controller.trigger('{SLUG}-request-after');
})

// when body is fully loaded
.listen('body', function() {
	var url = window.location.pathname;
	var id  = controller.getUrlSegment(-1);

	// if tab is already rendered
	if(jQuery('section.{SLUG}-update ul.nav-tabs li.{SLUG}-profile-tab').length !== 0) {
		// just do nothing
		return;
	}

	require(['text!' + controller.path('{SLUG}/template') + '/form/tabs.html'], function(html) {
		html = Handlebars.compile(html)({ id : id, url : url });
		jQuery('section.{SLUG}-update ul.nav.nav-tabs').prepend(html)
	});
});