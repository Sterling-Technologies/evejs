controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('{{slug}}'			, controller.path('package') + '/{{vendor}}/{{slug}}')
		.path('{{slug}}/action'		, controller.path('package') + '/{{vendor}}/{{slug}}/action')
		.path('{{slug}}/asset'		, controller.path('package') + '/{{vendor}}/{{slug}}/asset')
		.path('{{slug}}/template'	, controller.path('package') + '/{{vendor}}/{{slug}}/template');

	//load the factory
	require([controller.path('{{slug}}') + '/factory.js'], function(factory) {
		controller.{{slug}} = factory;
		controller.trigger('{{slug}}-init');
	});
})
//when the menu is about to be rendered
.listen('menu', function(e, menu) {
	// event when the {{slug}} menu is starting
	controller.trigger('{{slug}}-menu-before');

	//add our menu item
	menu.push({
		path	: '/{{slug}}',
		icon	: '{{icon}}',
		label	: '{{plural}}',
		children: [{
			path	: '/{{slug}}/create',
			label	: 'Create {{singular}}' }]
		});

	// event when the {{slug}} menu is finished
	controller.trigger('{{slug}}-menu-after');
})
//when a url request has been made
.listen('request', function() {
	//event when the {{slug}} request is starting
	controller.trigger('{{slug}}-request-before');

	//if it doesn't start with {{slug}}
	if(window.location.pathname.indexOf('/{{slug}}') !== 0) {
		//we don't care about it
		return;
	}
	
	//router -> action
	var route = { action: null };
	switch(true) {
		case window.location.pathname.indexOf('/{{slug}}/create') === 0:
			route.action = 'create';
			break;
		case window.location.pathname.indexOf('/{{slug}}/update') === 0:
			route.action = 'update';
			break;
		case window.location.pathname.indexOf('/{{slug}}/remove') === 0:
			route.action = 'remove';
			break;
		case window.location.pathname.indexOf('/{{slug}}/restore') === 0:
			route.action = 'restore';
			break;
		case window.location.pathname.indexOf('/{{slug}}/bulk') === 0:
			route.action = 'bulk';
			break;
		{{#if use_revision ~}}
		case window.location.pathname.indexOf('/{{slug}}/revision') === 0:
			route.action = 'revision';
			break;
		{{/if~}}
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
})

// when body is fully loaded
.listen('body', function() {
	var url = window.location.pathname;
	var id  = controller.getUrlSegment(3);

	// if tab is already rendered
	if(jQuery('section.{{slug}}-update ul.nav-tabs li.{{slug}}-update-tab').length !== 0) {
		// just do nothing
		return;
	}

	require(['text!' + controller.path('{{slug}}/template') + '/tabs.html'], function(html) {
		html = Handlebars.compile(html)({ id : id, url : url });
		jQuery('section.{{slug}}-update ul.nav.nav-tabs').prepend(html);
	});
});