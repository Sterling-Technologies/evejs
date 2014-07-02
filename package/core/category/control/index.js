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
		icon	: 'pencil',
		label	: 'Category',
		children: [{
			path	: '/category/create',
			label	: 'Create Category' }]
		});
})
//when a url request has been made
.listen('request', function() {
	// cache post index
	var postIndex = window.location.pathname.indexOf('/post');

	//if it doesn't start with category
	if(window.location.pathname.indexOf('/category') !== 0 && postIndex !== 0) {
		//we don't care about it
		return;
	}

	// check if we are on the post page
	if(postIndex == 0) {
		$('.table')
	}

	//router -> action
	var action = 'index';
	switch(true) {
		case window.location.pathname.indexOf('/category/create') === 0:
			action = 'create';
			break;
		case window.location.pathname.indexOf('/category/update') === 0:
			action = 'update';
			break;
		case window.location.pathname.indexOf('/category/remove') === 0:
			action = 'remove';
			break;
		case window.location.pathname.indexOf('/category/restore') === 0:
			action = 'restore';
			break;
		case window.location.pathname.indexOf('/category/bulk') === 0:
			action = 'bulk';
			break;
	}
	
	action = controller.path('category/action') + '/' + action + '.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});
});