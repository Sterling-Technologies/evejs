define(function() {
	return function(e, settings, request, action) {
		//validate
		var errors = this.package('auth').getErrors(settings);
		
		//if there are errors
		if(errors.length) {
			//trigger an error
			this.trigger('auth-login-error', { 
				message: 'There was an error in the form.',
				validation: errors }, request, action);
			
			return;
		}
		
		
		if(settings.auth_password) {
			settings.auth_password = this.String().md5(''+settings.auth_password);
		}
		
		//send to server
		this.package('auth').login(settings, function(error, response) {
			//if there is an error
			if(error) {
				//Add to gritter
				//trigger an error
				this.trigger('auth-login-error', error, request, action);
				return;
			}
			
			if(!response.error) {
				this.trigger('auth-login-success', response.results, request, action)		
				return;
			}
			
			error = { message: response.message };
			
			if(response.validation && response.validation instanceof Array) {
				error.validation = response.validation 
			}
			
			this.trigger('auth-login-error', error, request, action);
		}.bind(this)).send();
	};
});