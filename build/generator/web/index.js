controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('{SLUG}'			, controller.path('package') + '/{VENDOR}/{SLUG}/')
		.path('{SLUG}/action'	, controller.path('package') + '/{VENDOR}/{SLUG}/action/')
		.path('{SLUG}/block'	, controller.path('package') + '/{VENDOR}/{SLUG}/block/')
		.path('{SLUG}/template'	, controller.path('package') + '/{VENDOR}/{SLUG}/template/');	
	
	//load the factory
	require([controller.path('{SLUG}') + 'factory.js'], function(factory) {
		controller.{SLUG} = factory;
		controller.trigger('{SLUG}-init');
	});
})

//when a url request has been made
.listen('request', function() {
	//event when the {SLUG} request is starting
	controller.trigger('{SLUG}-request-before');

	//if the package has not initialized
	//if it doesn't start with {SLUG}
	if(!controller.{SLUG} 
	|| window.location.pathname.indexOf('/{SLUG}') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var route = { action: null };
	switch(true) {
		// TODO: ADD ROUTES HERE
		case window.location.pathname === '/{SLUG}':
			route.action = 'index';
			break;
	}

	// if there is no route
	if(!route.action) {
		// just do nothing
		return;
	}
	
	route.path = controller.path('{SLUG}/action') + '/' + route.action + '.js';
	
	//event when the {SLUG} action is about to render
	controller.trigger('{SLUG}-action-' + route.action + '-before', route);
	
	//load up the action
	require([route.path], function(action) {
		action.load().render();
		
		//event when the {SLUG} action is rendered
		controller.trigger('{SLUG}-action-' + route.action + '-after', route);
	});

	// event when the {SLUG} request is finished
	controller.trigger('{SLUG}-request-after');
});