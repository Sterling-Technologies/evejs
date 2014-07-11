controller
//when the application is initialized
.listen('init', function() {
	//set paths
	controller
		.path('block'			, controller.path('package') + '/core/block')
		.path('block/action'	, controller.path('package') + '/core/block/action')
		.path('block/asset'		, controller.path('package') + '/core/block/asset')
		.path('block/template'	, controller.path('package') + '/core/block/template');
})
//add template helpers
.listen('engine', function() {
	//set pagination
	var $ = jQuery, _id = 0;
	//dynamically preload the block
	Handlebars.registerHelper('block', function (action, options) {
		var args 	= controller.args();
		action 		= args.shift();
		options 	= args.pop();
		
		//determine the path
		action = controller.path('block/action') + '/' + action + '.js';
		
		//load up the action
		var id = ++_id;
		require([action], function(action) {
			action = action.load();
			action.setData.apply(action, args);
			action.setInnerTemplate(options.fn);
			action.render(function(html) {
				$('#eve-block-'+ id).replaceWith(html);
			});
		});
		
		return '<div id="eve-block-' + id + '"></div>';
	});
})

//when a url request has been made
.listen('request', function() {
	//if it doesn't start with user
	if(window.location.pathname.indexOf('/block') !== 0) {
		//we don't care about it
		return;
	}
	
	action = controller.path('block/action') + '/index.js';
	
	//load up the action
	require([action], function(action) {
		action.load().render();
	});
});;