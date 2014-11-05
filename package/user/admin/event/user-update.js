define(function() {
	return function(e, id, settings, request, action) {
		//validate
		var errors = this.package('user').getErrors(settings);
		
		//if there are errors
		if(errors.length) {
			//trigger an error
			this.trigger('user-update-error', { 
				message: 'There was an error in the form.',
				validation: errors }, request, action);
			
			return;
		}
		
		//Convert to server date format
		//NOTE: BULK GENERATE
		if(settings.user_password) {
			settings.user_password = this.String().md5(''+settings.user_password);
		}
		
		//track progress
		this.on('progress', function progress(e, percent) {
			this.trigger('user-update-progress', percent, request, action);
		});
		
		//send to server
		this.package('user').update(id, settings, function(error, response) {
			//stop listening to the progress
			this.off('progress');
			
			//if there is an error
			if(error) {
				//Add to gritter
				//trigger an error
				this.trigger('user-update-error', error, request, action);
				return;
			}
			
			if(!response.error) {
				this.trigger('user-update-success', request, action)		
				return;
			}
			
			error = { message: response.message };
			
			if(response.validation && response.validation instanceof Array) {
				error.validation = response.validation 
			}
			
			this.trigger('user-update-error', error, request, action);
		}.bind(this)).send();
	};
});