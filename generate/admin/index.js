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
	require([this.path('{{name}}') + 'factory.js'], function(factory) {
		//add it to the base class definitions
		jQuery.eve.base.define({ {{name}}: factory });
		jQuery.eve.action.define({ {{name}}: factory });
		
		this.{{name}} = factory;
		this.trigger('{{name}}-init');
	}.bind(this));
})

//when the menu is about to be rendered
.on('menu', function(e, menu) {
	// event when the {{name}} menu is starting
	this.trigger('{{name}}-menu-before');

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
	this.trigger('{{name}}-menu-after');
})

//when a url request has been made
.on('request', function() {
	//event when the {{name}} request is starting
	this.trigger('{{name}}-request-before');

	//if the package has not initialized
	//if it doesn't start with {{name}}
	if(!this.{{name}} || window.location.pathname.indexOf('/{{name}}') !== 0) {
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
		default:
			route.action = 'index';
			break;
	}

	// if there is no route
	if(!route.action) {
		// just do nothing
		return;
	}
	
	route.path = this.path('{{name}}/action') + route.action + '.js';
	
	//event when the {{name}} action is about to render
	this.trigger('{{name}}-action-' + route.action + '-before', route);
	
	//load up the action
	require([route.path], function(action) {
		action().response();
		
		//event when the {{name}} action is rendered
		controller().trigger('{{name}}-action-' + route.action + '-after', route);
	});

	// event when the {{name}} request is finished
	this.trigger('{{name}}-request-after');
})

// when body is fully loaded
.on('body', function() {
	var url = window.location.pathname;
	var id  = this.getUrlSegment(3);

	// if tab is already rendered
	if(jQuery('section.{{name}}-update ul.nav-tabs li.{{name}}-update-tab').length !== 0) {
		// just do nothing
		return;
	}

	require(['text!' + this.path('{{name}}/template') + '/tabs.html'], function(html) {
		html = Handlebars.compile(html)({ id : id, url : url });
		jQuery('section.{{name}}-update ul.nav.nav-tabs').prepend(html);
	});
});