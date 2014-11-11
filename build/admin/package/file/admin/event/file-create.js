define(function() {
	return function(e, settings, request) {
		//track progress
		this.on('progress', function progress(e, percent) {
			this.trigger('file-create-progress', percent, request);
		});
		
		//send to server
		this.package('file').create(settings, function(error, response) {
			//stop listening to the progress
			this.off('progress');
			
			//if there is an error
			if(error) {
				//Add to gritter
				//trigger an error
				this.trigger('file-create-error', error, request);
				return;
			}
			
			if(!response.error) {
				if(!(response.results instanceof Array)) {
					response.results = [response.results];
				}
				
				for(var i = 0; i < response.results.length; i++) {
					this.trigger('file-create-success', response.results[i], request);	
				}
				
				return;
			}
			
			error = { message: response.message };
			
			if(response.validation && response.validation instanceof Array) {
				error.validation = response.validation 
			}
			
			this.trigger('file-create-error', error, request);
		}.bind(this)).send();
	};
});