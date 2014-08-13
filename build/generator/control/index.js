controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('{{name}}'			, controller.path('package') + '/{{vendor}}/{{name}}')
		.path('{{name}}/action'		, controller.path('package') + '/{{vendor}}/{{name}}/action')
		.path('{{name}}/asset'		, controller.path('package') + '/{{vendor}}/{{name}}/asset')
		.path('{{name}}/template'	, controller.path('package') + '/{{vendor}}/{{name}}/template');

	//load the factory
	require([controller.path('{{name}}') + '/factory.js'], function(factory) {
		controller.{{name}} = factory;
		controller.trigger('{{name}}-init');
	});
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	// event when the {{name}} menu is starting
	controller.trigger('{{name}}-menu-before');

	//add our menu item
	menu.push({
		path	: '/{{name}}',
		icon	: '{{icon}}',
		label	: '{{plural}}',
		children: [{
			path	: '/{{name}}/create',
			label	: 'Create {{singular}}' }]
		});

	// event when the {{name}} menu is finished
	controller.trigger('{{name}}-menu-after');
})
//when a url request has been made
.listen('request', function() {
	//event when the {{name}} request is starting
	controller.trigger('{{name}}-request-before');

	//if it doesn't start with {{name}}
	if(window.location.pathname.indexOf('/{{name}}') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var route = { action: null };
	switch(true) {
		case window.location.pathname.indexOf('/{{name}}/create') === 0:
			route.action = 'create';
			break;
		case window.location.pathname.indexOf('/{{name}}/update') === 0:
			route.action = 'update';
			break;
		case window.location.pathname.indexOf('/{{name}}/remove') === 0:
			route.action = 'remove';
			break;
		case window.location.pathname.indexOf('/{{name}}/restore') === 0:
			route.action = 'restore';
			break;
		case window.location.pathname.indexOf('/{{name}}/bulk') === 0:
			route.action = 'bulk';
			break;
		{{#if revision ~}}
		case window.location.pathname.indexOf('/{{name}}/revision') === 0:
			route.action = 'revision';
			break;
		{{/if~}}
		default:
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
})

// when body is fully loaded
.listen('body', function() {
	var url = window.location.pathname;
	var id  = controller.getUrlSegment(3);

	// if tab is already rendered
	if(jQuery('section.{{name}}-update ul.nav-tabs li.{{name}}-update-tab').length !== 0) {
		// just do nothing
		return;
	}

	require(['text!' + controller.path('{{name}}/template') + '/tabs.html'], function(html) {
		html = Handlebars.compile(html)({ id : id, url : url });
		jQuery('section.{{name}}-update ul.nav.nav-tabs').prepend(html);
	});
});