controller()
//when the application is initialized
.on('init', function() {
	//set paths
	this
		.path('sink'			, this.path('package') + '/core/sink/')
		.path('sink/action'		, this.path('package') + '/core/sink/action/')
		.path('sink/block'		, this.path('package') + '/core/sink/block/')
		.path('sink/template'	, this.path('package') + '/core/sink/template/');	
	
	//load the factory
	require([this.path('sink') + 'factory.js'], function(factory) {
		//add it to the base class definitions
		jQuery.eve.base.define({ sink: factory });
		jQuery.eve.action.define({ sink: factory });
		
		this.sink = factory;
		this.trigger('sink-init');
	}.bind(this));
})

//when the menu is about to be rendered
.on('menu', function(e, menu) {
	// event when the sink menu is starting
	this.trigger('sink-menu-before');

	//add our menu item
	menu.push({
		path	: '/sink',
		icon	: 'facebook',
		label	: 'Items',
		children: [{
			path	: '/sink/create',
			label	: 'Create Item' }]
		});

	// event when the sink menu is finished
	this.trigger('sink-menu-after');
})

//when a url request has been made
.on('request', function() {
	//event when the sink request is starting
	this.trigger('sink-request-before');

	//if the package has not initialized
	//if it doesn't start with sink
	if(!this.sink || window.location.pathname.indexOf('/sink') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var route = { action: null };
	switch(true) {
		case window.location.pathname.indexOf('/sink/create') === 0:
			route.action = 'create';
			break;
		case window.location.pathname.indexOf('/sink/update') === 0:
			route.action = 'update';
			break;
		case window.location.pathname.indexOf('/sink/remove') === 0:
			route.action = 'remove';
			break;
		case window.location.pathname.indexOf('/sink/restore') === 0:
			route.action = 'restore';
			break;
		case window.location.pathname.indexOf('/sink/bulk') === 0:
			route.action = 'bulk';
			break;
		default:
			route.action = 'index';
			break;
	}

	// if there is no route
	if(!route.action) {
		// just do nothing
		return;
	}
	
	route.path = this.path('sink/action') + route.action + '.js';
	
	//event when the sink action is about to render
	this.trigger('sink-action-' + route.action + '-before', route);
	
	//load up the action
	require([route.path], function(action) {
		action().response();
		
		//event when the sink action is rendered
		controller().trigger('sink-action-' + route.action + '-after', route);
	});

	// event when the sink request is finished
	this.trigger('sink-request-after');
})

// when body is fully loaded
.on('body', function() {
	var url = window.location.pathname;
	var id  = this.getUrlSegment(3);

	// if tab is already rendered
	if(jQuery('section.sink-update ul.nav-tabs li.sink-update-tab').length !== 0) {
		// just do nothing
		return;
	}

	require(['text!' + this.path('sink/template') + '/tabs.html'], function(html) {
		html = Handlebars.compile(html)({ id : id, url : url });
		jQuery('section.sink-update ul.nav.nav-tabs').prepend(html);
	});
});