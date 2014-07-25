controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('category-user'			, controller.path('package') + '/core/category-user')
		.path('category-user/action'	, controller.path('package') + '/core/category-user/action')
		.path('category-user/asset'		, controller.path('package') + '/core/category-user/asset')
		.path('category-user/template'	, controller.path('package') + '/core/category-user/template');
})

.listen('request', function() {
	//event when the user request is starting
	controller.trigger('category-user-request-before');

	//if it doesn't start with user
	if(window.location.pathname.indexOf('/user/category') !== 0 &&
	   window.location.pathname.indexOf('/category/users') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var route = { action: null };
	switch(true) {
		case window.location.pathname.indexOf('/user/category') === 0:
			route.action = 'users/index';
			break;
		case window.location.pathname.indexOf('/category/users') === 0:
			route.action = 'category/index';
			break;
	}

	// if there is no route
	if(!route.action) {
		// just do nothing
		return;
	}
	
	route.path = controller.path('category-user/action') + '/' + route.action + '.js';
	
	//event when the user action is about to render
	controller.trigger('category-user-action-' + route.action + '-before', route);

	//load up the action
	require([route.path], function(action) {
		action.load().render();
		
		//event when the user action is rendered
		controller.trigger('category-user-action-' + route.action + '-after', route);
	});

	// event when the user request is finished
	controller.trigger('category-user-request-after');
})

// when body is fully loaded
.listen('body', function() {
	var url = window.location.pathname;
	var id  = controller.getUrlSegment(-1);

	if(url.indexOf('/user') === 0) {
		// if tab is already rendered
		if(jQuery('section.user-update ul.nav-tabs li.user-category-tab').length !== 0) {
			// just do nothing
			return;
		}

		require(['text!' + controller.path('category-user/template') + '/users/tabs.html'], function(html) {
			html = Handlebars.compile(html)({ id : id, url : url });
			jQuery('section.user-update ul.nav.nav-tabs').append(html)
		});
	} else if(url.indexOf('/category') === 0) {
		// if tab is already rendered
		if(jQuery('section.category-update ul.nav-tabs li.category-users-tab').length !== 0) {
			// just do nothing
			return;
		}

		require(['text!' + controller.path('category-user/template') + '/category/tabs.html'], function(html) {
			html = Handlebars.compile(html)({ id : id, url : url });
			jQuery('section.category-update ul.nav.nav-tabs').append(html);
		});
	}
});