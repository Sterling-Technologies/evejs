controller
//when the application is initialized
.listen('init', function() {
	//comment test 2
	//set paths
	controller
		.path('address-user'			, controller.path('package') + '/core/address-user')
		.path('address-user/action'		, controller.path('package') + '/core/address-user/action')
		.path('address-user/asset'		, controller.path('package') + '/core/address-user/asset')
		.path('address-user/template'	, controller.path('package') + '/core/address-user/template');
})

.listen('request', function() {
	//event when the user request is starting
	controller.trigger('address-user-request-before');

	//if it doesn't start with user
	if(window.location.pathname.indexOf('/user/address') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var route = { action: 'index' };
	switch(true) {
		case window.location.pathname.indexOf('/user/address/create') === 0:
			route.action = 'create';
			break;
		case window.location.pathname.indexOf('/user/address') === 0:
			route.action = 'index';
			break;
	}
	
	route.path = controller.path('address-user/action') + '/' + route.action + '.js';
	
	//event when the user action is about to render
	controller.trigger('address-user-action-' + route.action + '-before', route);

	//load up the action
	require([route.path], function(action) {
		action.load().render();
		
		//event when the user action is rendered
		controller.trigger('address-user-action-' + route.action + '-after', route);
	});

	// event when the user request is finished
	controller.trigger('address-user-request-after');
})

// when body is fully loaded
.listen('body', function() {
	var url = window.location.pathname;
	var id  = controller.getUrlSegment(-1);

	// if tab is already rendered
	if(jQuery('section.user-update ul.nav-tabs li.user-address-tab').length !== 0) {
		// just do nothing
		return;
	}

	require(['text!' + controller.path('address-user/template') + '/tabs.html'], function(html) {
		html = Handlebars.compile(html)({ id : id, url : url });
		jQuery('section.user-update ul.nav.nav-tabs').append(html)
	});
});