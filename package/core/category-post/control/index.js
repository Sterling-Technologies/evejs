controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('category-post'			, controller.path('package') + '/core/category-post')
		.path('category-post/action'	, controller.path('package') + '/core/category-post/action')
		.path('category-post/asset'		, controller.path('package') + '/core/category-post/asset')
		.path('category-post/template'	, controller.path('package') + '/core/category-post/template');
})

.listen('request', function() {
	//event when the category-post request is starting
	controller.trigger('category-post-request-before');

	//if it doesn't start with post
	if(window.location.pathname.indexOf('/post/create') !== 0 &&
	   window.location.pathname.indexOf('/post/update') !== 0 &&
	   window.location.pathname.indexOf('/category/post') !== 0) {
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
		case window.location.pathname.indexOf('/category/post') === 0 :
			route.action = 'category/index';
			break;
	}

	// if there is no route
	if(!route.action) {
		// just do nothing
		return;
	}
	
	route.path = controller.path('category-post/action') + '/' + route.action + '.js';
	
	//event when the category-post action is about to render
	controller.trigger('category-post-action-' + route.action + '-before', route);

	//load up the action
	require([route.path], function(action) {
		action.load().render();
		
		//event when the category-post action is rendered
		controller.trigger('category-post-action-' + route.action + '-after', route);
	});

	// event when the category-post request is finished
	controller.trigger('category-post-request-after');
})

// when body is fully loaded
.listen('body', function() {
	var url = window.location.pathname;
	var id  = controller.getUrlSegment(-1);

	// if tab is already rendered
	if(jQuery('section.category-update ul.nav-tabs li.category-post-tab').length !== 0) {
		// just do nothing
		return;
	}

	require(['text!' + controller.path('category-post/template') + '/category/tabs.html'], function(html) {
		html = Handlebars.compile(html)({ id : id, url : url });
		jQuery('section.category-update ul.nav.nav-tabs').append(html)
	});
});