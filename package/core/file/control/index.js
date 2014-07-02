controller
//when the application is initialized
.listen('init', function() {
	//comment test 2
	//set paths
	controller
		.path('file'			, controller.path('package') + '/core/file')
		.path('file/action'		, controller.path('package') + '/core/file/action')
		.path('file/asset'		, controller.path('package') + '/core/file/asset')
		.path('file/template'	, controller.path('package') + '/core/file/template');
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	//add our menu item
	menu.push({
		path	: '/file',
		icon	: 'file',
		label	: 'Files',
		children: [] });
})
//when a url request has been made
.listen('request', function() {
	//if it doesn't start with file
	if(window.location.pathname.indexOf('/file') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var action = 'index';
	switch(true) {
		case window.location.pathname.indexOf('/file/create') === 0:
			action = 'create';
			break;
		case window.location.pathname.indexOf('/file/update') === 0:
			action = 'update';
			break;
		case window.location.pathname.indexOf('/file/remove') === 0:
			action = 'remove';
			break;
		case window.location.pathname.indexOf('/file/restore') === 0:
			action = 'restore';
			break;
		case window.location.pathname.indexOf('/file/bulk') === 0:
			action = 'bulk';
			break;
	}
	
	action = controller.path('file/action') + '/' + action + '.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});
});