module.exports = function(settings, request, response) {
	//validate
	var errors = this.package('auth').getErrors(settings);
	
	//if there are errors
	if(errors.length) {
		//trigger an error
		this.trigger('auth-login-error', { 
			message: 'Data sent to server is invalid', 
			errors: errors 
		}, request, response);
		
		return;
	}
	
	this.package('user')
		.search()
		.addFilter(
			'(user_slug = ? OR user_email = ?) AND user_password = ?',
			//for now passwords are not encrypted, change to md5
			settings.auth_user, settings.auth_user, settings.auth_password)
		.getRow(function(error, row) {
			//if there are errors
			if(error) {
				//trigger an error
				this.trigger('auth-login-error', error, request, response);
				return;
			}
			
			if(!row) {
				//trigger an error
				this.trigger('auth-login-error', 'User or Password is invalid.', request, response);
				return;
			}
			
			//create a token
			// for the user, we can just
			// use id+slug+password for
			// hmac signature
			var signature = row.user_id + row.user_created;
			// and user id for hmac key
			var key 	  = row.user_id.toString();
			// Create hmac token with sha-1 algorithm and hex digest
			var hmac      = this.String().hmac(signature, key, 'sha1', 'hex');
			
			//save to database
			this.package('auth').model({
				auth_id: hmac,
				auth_user: row.user_id
			}).save(function(error, model, meta) {
				//if there are errors
				if(error) {
					//trigger an error
					this.trigger('auth-login-error', error, request, response);
					return;
				}
				
				//if no rows updated
				if(!meta.affectedRows) {
					//manually insert
					this.database().insertRow('auth', {
						auth_id: hmac,
						auth_user: row.user_id
					}, function(error, model, meta) {
						//if there are errors
						if(error) {
							//trigger an error
							this.trigger('auth-login-error', error, request, response);
							return;
						}
						
						row.auth = hmac;
						//delete sensitive data
						delete row.password;
						this.trigger('auth-login-success', row, request, response);
					}.bind(this));
					
					return;
				}
				
				row.auth = hmac;
				//delete sensitive data
				delete row.password;
				this.trigger('auth-login-success', row, request, response);
			}.bind(this));
		}.bind(this));
};