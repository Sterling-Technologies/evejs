controller()
//when the application is initialized
.on('init', function() {
	//set paths
	this
		.path('block'			, this.path('package') + '/core/block')
		.path('block/action'	, this.path('package') + '/core/block/action')
		.path('block/asset'		, this.path('package') + '/core/block/asset')
		.path('block/template'	, this.path('package') + '/core/block/template');
	
	//add template helpers
	//set pagination
	var $ = jQuery, _id = 0;
	//dynamically preload the block
	Handlebars.registerHelper('block', function (action, options) {
		var args 	= Array.prototype.slice.apply(arguments);
		
		action 		= args.shift();
		options 	= args.pop();
		
		//determine the path
		action = controller().path('block/action') + '/' + action + '.js';
		
		//load up the action
		var id = ++_id;
		require([action], function(action) {
			action = action();
			action.setData.apply(action, args);
			action.setInnerTemplate(options.fn);
			action.response(function(html) {
				$('#eve-block-'+ id).replaceWith(html);
			});
		});
		
		return '<div id="eve-block-' + id + '"></div>';
	});
	
	this.trigger('block-init');
})

//when a url request has been made
.on('request', function() {
	//if it doesn't start with user
	if(window.location.pathname.indexOf('/block') !== 0) {
		//we don't care about it
		return;
	}
	
	action = this.path('block/action') + '/index.js';
	
	//load up the action
	require([action], function(action) {
		action().response();
	});
});;