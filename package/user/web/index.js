define(function() {
	return function() {
		//set paths
		this
			.path('user'			, this.path('package') + '/user')
			.path('user/action'		, this.path('package') + '/user/action')
			.path('user/event'		, this.path('package') + '/user/event')
			.path('user/template'	, this.path('package') + '/user/template');	
		
		//load the factory
		require([this.path('user') + '/factory.js'], function(factory) {
			//add it to the base class definitions
			jQuery.eve.base.define({ user: factory });
			
			this.user = factory;
			
			//get event path
			var events = this.user().path('event');
			
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
					
					this.trigger('user-init');
				}.bind(this));
			}.bind(this));
		}.bind(this));
		
		return 'user-init';
	};
});