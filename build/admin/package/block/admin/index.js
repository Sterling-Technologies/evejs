define(function() {
	return function() {
		//set paths
		this
			.path('block'			, this.path('package') + '/block')
			.path('block/asset'		, this.path('package') + '/block/asset')
			.path('block/action'	, this.path('package') + '/block/action')
			.path('block/event'		, this.path('package') + '/block/event')
			.path('block/template'	, this.path('package') + '/block/template');	
		
		//add template helpers
		//set pagination
		var $ = jQuery, _id = 0, controller = this;
		//dynamically preload the block
		Handlebars.registerHelper('block', function (action, options) {
			var args 	= Array.prototype.slice.apply(arguments);
			
			action 		= args.shift();
			options 	= args.pop();
			
			//determine the path
			var path = controller.path('block/action') + '/' + action + '.js';
			
			var request = {
				id		: ++_id,
				path	: path,
				action	: action };
			
			//load up the action
			require([path], function(action) {
				action = action();
				action.setData.apply(action, args);
				action.setInnerTemplate(options.fn);
				action.response(request);
			});
			
			return '<div id="eve-block-' + request.id + '" class="eve-block"></div>';
		});
		
		//get event path
		var events = this.path('block/event');
		
		//get files in the event folder
		this.Folder(events).getFiles(null, false, function(error, files) {
			//loop through files  
			for(var events = [], callbacks = [], i = 0; i < files.length; i++) {
				//accept only js
				if(files[i].getExtension() !== 'js') {
					continue;
				}
				
				events.push(files[i].getBase());
				callbacks.push(files[i].path);
			}
			
			require(callbacks, function() {
				var callbacks = Array.prototype.slice.apply(arguments);
				
				//loop through events 
				for(var i = 0; i < callbacks.length; i++) {
					//only listen if it is a callback
					if(typeof callbacks[i] !== 'function') {
						continue;
					}
					
					//now listen
					this.on(events[i], callbacks[i]);
				}
				
				this.trigger('block-init');
			}.bind(this));
		}.bind(this));
		
		return 'block-init';
	};
});