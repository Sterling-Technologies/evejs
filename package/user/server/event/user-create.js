module.exports = function(settings, request, response) {
	//validate
	var errors = this.package('user').getErrors(settings);
	
	//if there are errors
	if(errors.length) {
		//trigger an error
		this.trigger('user-create-error', { 
			message: 'Data sent to server is invalid', 
			errors: errors 
		}, request, response);
		
		return;
	}
	settings.user_created = this.Time().toDate(Date.now(), 'Y-m-d H:i:s');
	
	settings.user_updated = this.Time().toDate(Date.now(), 'Y-m-d H:i:s');
	
	this.package('user').getSlug(settings.user_name, null, function(error, slug) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('user-create-error', error, request, response);
			return;
		}
		
		settings.user_slug = slug;
		
		//create the model and save
		this.package('user').model(settings).save(function(error, model) {
			//if there are errors
			if(error) {
				//trigger an error
				this.trigger('user-create-error', error, request, response);
				return;
			}
			
			//trigger that we are good
			this.trigger('user-create-success', model.user_id, request, response);
		}.bind(this));
	}.bind(this));
};