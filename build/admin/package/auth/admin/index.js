define(function() {
	return function() {
		jQuery.ajaxSetup({
			beforeSend: function(jqXHR, settings) {
				//if it does not starts with the server url
				//is there already an auth parameter?
				//or if no auth cookie
				if(settings.url.indexOf(this.getServerUrl()) !== 0
				|| this.String().pathToQuery(settings.url).auth
				|| !this.cookie('auth')) {
					//let it be
					return;
				}
				
				//append auth in every request
				var separator = '?';
				
				//is there a question mark ?
				if(settings.url.indexOf('?') !== -1) {
					separator = '&';
				}
				
				settings.url += separator + 'auth=' + this.cookie('auth');
			}.bind(this)
		});		
		
		//set paths
		this
			.path('auth'			, this.path('package') + '/auth')
			.path('auth/action'		, this.path('package') + '/auth/action')
			.path('auth/event'		, this.path('package') + '/auth/event')
			.path('auth/template'	, this.path('package') + '/auth/template');	
		
		//load the factory
		require([this.path('auth') + '/factory.js'], function(factory) {
			//add it to the global factory
			this.package('auth', factory);
			
			//get event path
			var events = this.package('auth').path('event');
			
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
					
					this.trigger('auth-init');
				}.bind(this));
			}.bind(this));
		}.bind(this));
		
		return 'auth-init';
	};
});