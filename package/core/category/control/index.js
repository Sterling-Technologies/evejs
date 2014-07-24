controller
//when the application is initialized
.listen('init', function() {
	//comment test 2
	//set paths
	controller
		.path('category'			, controller.path('package') + '/core/category')
		.path('category/action'		, controller.path('package') + '/core/category/action')
		.path('category/asset'		, controller.path('package') + '/core/category/asset')
		.path('category/template'	, controller.path('package') + '/core/category/template');
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	//add our menu item
	menu.push({
		path	: '/category',
		icon	: 'sitemap',
		label	: 'Category',
		children: [{
			path	: '/category/create',
			label	: 'Create Category' }]
		});
})
//when a url request has been made
.listen('request', function() {
	// trigger category request before
	controller.trigger('category-request-before');

	//if it doesn't start with category
	if(window.location.pathname.indexOf('/category') !== 0) {
		//we don't care about it
		return;
	}

	//router -> action
	var route = { action : null };
	switch(true) {
		case window.location.pathname.indexOf('/category/create') === 0:
			route.action = 'create';
			break;
		case window.location.pathname.indexOf('/category/update') === 0:
			route.action = 'update';
			break;
		case window.location.pathname.indexOf('/category/remove') === 0:
			route.action = 'remove';
			break;
		case window.location.pathname.indexOf('/category/restore') === 0:
			route.action = 'restore';
			break;
		case window.location.pathname.indexOf('/category/bulk') === 0:
			route.action = 'bulk';
			break;
		case window.location.pathname == '/category' || 
			 window.location.pathname.indexOf('/category/child') === 0 :
			 
			route.action = 'index';
			break;
	}
	
	// if there is no route
	if(!route.action) {
		// just do nothing
		return;
	}

	route.path = controller.path('category/action') + '/' + route.action + '.js';

	//event when the category action is about to render
	controller.trigger('category-action-' + route.action + '-before', route);
	
	//load up the action
	require([route.path], function(action) {
		action.load().render();
		
		//event when the category action is rendered
		controller.trigger('category-action-' + route.action + '-after', route);
	});

	// event when the category request is finished
	controller.trigger('category-request-after');

})

// when body is fully loaded
.listen('body', function() {
	var url = window.location.pathname;
	var id  = controller.getUrlSegment(-1);

	// if tab is already rendered
	if(jQuery('section.category-update ul.nav-tabs li.category-info-tab').length !== 0) {
		// just do nothing
		return;
	}

	require(['text!' + controller.path('category/template') + '/tabs.html'], function(html) {
		html = Handlebars.compile(html)({ id : id, url : url });
		jQuery('section.category-update ul.nav.nav-tabs').prepend(html)
	});
});