controller()
//when the application is initialized
.on('init', function() {
	//set paths
	this
		.path('{{name}}'			, this.path('package') + '/{{vendor}}/{{name}}/')
		.path('{{name}}/action'		, this.path('package') + '/{{vendor}}/{{name}}/action/')
		.path('{{name}}/block'		, this.path('package') + '/{{vendor}}/{{name}}/block/')
		.path('{{name}}/template'	, this.path('package') + '/{{vendor}}/{{name}}/template/');	
	
	//load the factory
	require([this.path('{{name}}') + '/factory.js'], function(factory) {
		this.{{name}} = factory;
		this.trigger('{{name}}-init');
	});
})

//when a url request has been made
.on('request', function() {
	//event when the {{name}} request is starting
	this.trigger('{{name}}-request-before');

	//if the package has not initialized
	//if it doesn't start with {{name}}
	if(!this.{{name}} 
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
	
	route.path = this.path('{{name}}/action') + '/' + route.action + '.js';
	
	//event when the {{name}} action is about to render
	this.trigger('{{name}}-action-' + route.action + '-before', route);
	
	//load up the action
	require([route.path], function(action) {
		action().load().render();
		
		//event when the {{name}} action is rendered
		controller().trigger('{{name}}-action-' + route.action + '-after', route);
	});

	// event when the {{name}} request is finished
	this.trigger('{{name}}-request-after');
});