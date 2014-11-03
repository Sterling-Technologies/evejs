define(function() {
	return function() {
		//set paths
		this
			.path('file'			, this.path('package') + '/file')
			.path('file/action'	, this.path('package') + '/file/action')
			.path('file/event'	, this.path('package') + '/file/event')
			.path('file/template', this.path('package') + '/file/template');	
		
		//load the factory
		require([this.path('file') + '/factory.js'], function(factory) {
			//add it to the global factory
			this.package('file', factory);
			
			//get event path
			var events = this.package('file').path('event');
			
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
					
					this.trigger('file-init');
				}.bind(this));
			}.bind(this));
		}.bind(this));
		
		return 'file-init';
	};
});