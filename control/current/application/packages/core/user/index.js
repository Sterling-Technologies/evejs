controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('user'			, controller.path('packages') + '/core/user/')
		.path('user/page'		, controller.path('packages') + '/core/user/page/')
		.path('user/template'	, controller.path('packages') + '/core/user/template/');
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
			query = controller.queryToHash(queryString);
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
				query	: controller.hashToQuery(query) });
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
	var page = 'index';
	switch(window.location.pathname.split('/')[2]) {
        case 'create':
            page = 'create';
            break;
        case 'update':
            page = 'update';
            break;
    }
	
	page = controller.path('user/page') + page + '.js';
	
	//load up the action
	require([page], function(page) {
		page.render();
	});
});