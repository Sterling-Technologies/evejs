controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('address'			, controller.path('package') + '/core/address')
		.path('address/action'		, controller.path('package') + '/core/address/action')
		.path('address/asset'		, controller.path('package') + '/core/address/asset')
		.path('address/template'	, controller.path('package') + '/core/address/template');
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	//add our menu item
	menu.push({
		path	: '/address',
		icon	: 'home',
		label	: 'Address',
		children: [{
			path	: '/address/create',
			label	: 'Create address' }]
		});
})
//when a url request has been made
.listen('request', function() {
	//if it doesn't start with address
	if(window.location.pathname.indexOf('/address') !== 0) {
		//we don't care about it
		return;
	}

	//router -> action
	var route = { action : null };
	switch(true) {
		case window.location.pathname.indexOf('/address/create') === 0:
			route.action = 'create';
			break;
		case window.location.pathname.indexOf('/address/update') === 0:
			route.action = 'update';
			break;
		case window.location.pathname.indexOf('/address/remove') === 0:
			route.action = 'remove';
			break;
		case window.location.pathname.indexOf('/address/restore') === 0:
			route.action = 'restore';
			break;
		case window.location.pathname.indexOf('/address/bulk') === 0:
			route.action = 'bulk';
			break;
		case window.location.pathname == '/address' :
			route.action = 'index';
			break;
	}
	
	// if there is no route
	if(!route.action) {
		// just do nothing
		return;
	}

	route.path = controller.path('address/action') + '/' + route.action + '.js';

	//event when the address action is about to render
	controller.trigger('address-action-' + route.action + '-before', route);
	
	//load up the action
	require([route.path], function(action) {
		action.load().render();
		
		//event when the address action is rendered
		controller.trigger('address-action-' + route.action + '-after', route);
	});

	// event when the address request is finished
	controller.trigger('address-request-after');
})

// when body is fully loaded
.listen('body', function() {
	var url = window.location.pathname;
	var id  = controller.getUrlSegment(-1);

	// if tab is already rendered
	if(jQuery('section.address-update ul.nav-tabs li.address-info-tab').length !== 0) {
		// just do nothing
		return;
	}

	require(['text!' + controller.path('address/template') + '/tabs.html'], function(html) {
		html = Handlebars.compile(html)({ id : id, url : url });
		jQuery('section.address-update ul.nav.nav-tabs').append(html)
	});
});