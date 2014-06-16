controller
//when the application is initialized
.listen('init', function() {
	//comment test 2
	//set paths
	controller
		.path('user'			, controller.path('package') + '/core/user')
		.path('user/action'		, controller.path('package') + '/core/user/action')
		.path('user/asset'		, controller.path('package') + '/core/user/asset')
		.path('user/template'	, controller.path('package') + '/core/user/template');
})
//add template helpers
.listen('engine', function() {
	//set pagination
	Handlebars.registerHelper('pagination', function (total, range, options) {
		//get current query
		var query 		= {},
			current		= 1,
			queryString = window.location.href.split('?')[1];
		
		//if we have a query string
		if(queryString && queryString.length) {
			//make it into an object
			query = jQuery.queryToHash(queryString);
			//remember the current page
			current = query.page || 1;
		}
		
		//how many pages?
		var pages = Math.ceil(total / range);
		
		//if there is one or less pages
		if(pages < 2) {
			//there is no need for pagination
			return null;
		}
		
		var html = '';
		for(var i = 0; i < pages; i++) {
			query.page = i + 1;
			html += options.fn({
				page	: i + 1,
				active	: current == (i + 1),
				query	: jQuery.hashToQuery(query) });
		}
		  
		return html;
	});
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	//add our menu item
	menu.push({
		path	: '/user',
		icon	: 'user',
		label	: 'Users',
		children: [{
			path	: '/user/create',
			label	: 'Create User' }]
		});
})
//when a url request has been made
.listen('request', function() {
	//if it doesn't start with user
	if(window.location.pathname.indexOf('/user') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var action = 'index';
	switch(true) {
		case window.location.pathname.indexOf('/user/create') === 0:
			action = 'create';
			break;
		case window.location.pathname.indexOf('/user/remove') === 0:
			action = 'remove';
			break;
	}
	
	action = controller.path('user/action') + '/' + action + '.js';
	
	//load up the action
	require([action], function(action) {
		action.render();
	});
});