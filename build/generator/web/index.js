controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('{{name}}'			, controller.path('package') + '/{{vendor}}/{{name}}/')
		.path('{{name}}/action'		, controller.path('package') + '/{{vendor}}/{{name}}/action/')
		.path('{{name}}/block'		, controller.path('package') + '/{{vendor}}/{{name}}/block/')
		.path('{{name}}/template'	, controller.path('package') + '/{{vendor}}/{{name}}/template/');	
	
	//load the factory
	require([controller.path('{{name}}') + '/factory.js'], function(factory) {
		controller.{{name}} = factory;
		controller.trigger('{{name}}-init');
	});
})

//when a url request has been made
.listen('request', function() {
	//event when the {{name}} request is starting
	controller.trigger('{{name}}-request-before');

	//if the package has not initialized
	//if it doesn't start with {{name}}
	if(!controller.{{name}} 
	|| window.location.pathname.indexOf('/{{name}}') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var route = { action: null };
	switch(true) {
		// TODO: ADD ROUTES HERE
		case window.location.pathname === '/{{name}}':
			route.action = 'index';
			break;
	}

	// if there is no route
	if(!route.action) {
		// just do nothing
		return;
	}
	
	route.path = controller.path('{{name}}/action') + '/' + route.action + '.js';
	
	//event when the {{name}} action is about to render
	controller.trigger('{{name}}-action-' + route.action + '-before', route);
	
	//load up the action
	require([route.path], function(action) {
		action.load().render();
		
		//event when the {{name}} action is rendered
		controller.trigger('{{name}}-action-' + route.action + '-after', route);
	});

	// event when the {{name}} request is finished
	controller.trigger('{{name}}-request-after');
});