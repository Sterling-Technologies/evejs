define(function() {
	return function() {
		//set paths
		this
			.path('{{name}}'			, this.path('package') + '/{{name}}')
			.path('{{name}}/action'	, this.path('package') + '/{{name}}/action')
			.path('{{name}}/event'		, this.path('package') + '/{{name}}/event')
			.path('{{name}}/template'	, this.path('package') + '/{{name}}/template');	
		
		//load the factory
		require([this.path('{{name}}') + '/factory.js'], function(factory) {
			//add it to the global factory
			this.package('{{name}}', factory);
			
			//get event path
			var events = this.Folder(this.package('{{name}}').path('event'));
			
			if(!events.isFolder()) {
				this.trigger('{{name}}-init');
				return;
			}
			
			//get files in the event folder
			events.getFiles(null, false, function(error, files) {
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
					
					this.trigger('{{name}}-init');
				}.bind(this));
			}.bind(this));
		}.bind(this));
		
		return '{{name}}-init';
	};
});