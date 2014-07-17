controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('user'			, controller.path('package') + '/core/user')
		.path('user/action'		, controller.path('package') + '/core/user/action')
		.path('user/asset'		, controller.path('package') + '/core/user/asset')
		.path('user/template'	, controller.path('package') + '/core/user/template');

	// actions
	controller.user = { 
		actions : [
			{
				action : controller.path('user/action') + '/create.js',
				path   : '/user/create'
			},
			{
				action : controller.path('user/action') + '/update.js',
				path   : '/user/update'
			},
			{
				action : controller.path('user/action') + '/remove.js',
				path   : '/user/remove'
			},
			{
				action : controller.path('user/action') + '/restore.js',
				path   : '/user/restore'
			},
			{
				action : controller.path('user/action') + '/bulk.js',
				path   : '/user/bulk'
			}
		]
	};

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

// when other packages wants to inject an
// action
.listen('user-add-action', function(e, callback) {
	controller.user.actions.push(callback()[0]);
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

	var actions  = controller.user.actions;
	var action 	 = controller.path('user/action') + '/index.js';

	// for each actions
	for(var i in actions) {
		if(window.location.pathname.indexOf(actions[i].path) === 0) {
			action = actions[i].action;
			break;
		}
	}

	//load up the action
	require([action], function(action) {
		action.load().render();
	});

	// event when the user request is finished
	controller.trigger('user-request-after');
});