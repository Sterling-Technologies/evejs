controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('post-user'			, controller.path('package') + '/core/post-user')
		.path('post-user/action'	, controller.path('package') + '/core/post-user/action')
		.path('post-user/asset'		, controller.path('package') + '/core/post-user/asset')
		.path('post-user/template'	, controller.path('package') + '/core/post-user/template');
})

.listen('request', function() {
	//event when the post-user request is starting
	controller.trigger('post-user-request-before');

	//if it doesn't start with post
	if(window.location.pathname.indexOf('/post/create') !== 0 &&
	   window.location.pathname.indexOf('/post/update') !== 0 &&
	   window.location.pathname.indexOf('/user/post') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var route = { action: null };
	switch(true) {
		case window.location.pathname.indexOf('/post/create') === 0 :
			route.action = 'post/widget';
			break;
		case window.location.pathname.indexOf('/post/update') === 0 :
			route.action = 'post/widget';
			break;
		case window.location.pathname.indexOf('/user/post') === 0 :
			route.action = 'user/index';
			break;
	}

	// if there is no route
	if(!route.action) {
		// just do nothing
		return;
	}
	
	route.path = controller.path('post-user/action') + '/' + route.action + '.js';
	
	//event when the post-user action is about to render
	controller.trigger('post-user-action-' + route.action + '-before', route);

	//load up the action
	require([route.path], function(action) {
		action.load().render();
		
		//event when the post-user action is rendered
		controller.trigger('post-user-action-' + route.action + '-after', route);
	});

	// event when the post-user request is finished
	controller.trigger('post-user-request-after');
})

// when body is fully loaded
.listen('body', function() {
	var url = window.location.pathname;
	var id  = controller.getUrlSegment(-1);

	// if tab is already rendered
	if(jQuery('section.user-update ul.nav-tabs li.user-post-tab').length !== 0) {
		// just do nothing
		return;
	}

	require(['text!' + controller.path('post-user/template') + '/user/tabs.html'], function(html) {
		html = Handlebars.compile(html)({ id : id, url : url });
		jQuery('section.user-update ul.nav.nav-tabs').append(html)
	});
});