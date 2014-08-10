controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('{{slug}}'			, controller.path('package') + '/{{vendor}}/{{slug}}/')
		.path('{{slug}}/action'		, controller.path('package') + '/{{vendor}}/{{slug}}/action/')
		.path('{{slug}}/block'		, controller.path('package') + '/{{vendor}}/{{slug}}/block/')
		.path('{{slug}}/template'	, controller.path('package') + '/{{vendor}}/{{slug}}/template/');	
	
	//load the factory
	require([controller.path('{{slug}}') + '/factory.js'], function(factory) {
		controller.{{slug}} = factory;
		controller.trigger('{{slug}}-init');
	});
})

//when a url request has been made
.listen('request', function() {
	//event when the {{slug}} request is starting
	controller.trigger('{{slug}}-request-before');

	//if the package has not initialized
	//if it doesn't start with {{slug}}
	if(!controller.{{slug}} 
	|| window.location.pathname.indexOf('/{{slug}}') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var route = { action: null };
	switch(true) {
		// TODO: ADD ROUTES HERE
		case window.location.pathname === '/{{slug}}':
			route.action = 'index';
			break;
	}

	// if there is no route
	if(!route.action) {
		// just do nothing
		return;
	}
	
	route.path = controller.path('{{slug}}/action') + '/' + route.action + '.js';
	
	//event when the {{slug}} action is about to render
	controller.trigger('{{slug}}-action-' + route.action + '-before', route);
	
	//load up the action
	require([route.path], function(action) {
		action.load().render();
		
		//event when the {{slug}} action is rendered
		controller.trigger('{{slug}}-action-' + route.action + '-after', route);
	});

	// event when the {{slug}} request is finished
	controller.trigger('{{slug}}-request-after');
});