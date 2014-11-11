module.exports = function(id, settings, request, response) {
	//validate
	var errors = this.package('user').getErrors(settings);
	
	//if there are errors
	if(errors.length) {
		//trigger an error
		this.trigger('user-update-error', { 
			message: 'Data sent to server is invalid', 
			errors: errors }, request, response);
		
		return;
	}
	settings.user_updated = this.Time().toDate(Date.now(), 'Y-m-d H:i:s');
	
	
	this.package('user')
	.search()
	.addFilter('user_id = ?', id)
	.getRow(function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('user-update-error', error, request, response);
			return;
		}
		
		this.package('user').getSlug(settings.user_name, row.user_slug, function(error, slug) {
			//if there are errors
			if(error) {
				//trigger an error
				this.trigger('user-update-error', error, request, response);
				return;
			}
			
			settings.user_slug = slug;
			
			//create the model and save
			var model = this.package('user').model(settings);
	
			model.user_id = id;
			
			model.save(function(error) {
				//if there are errors
				if(error) {
					//trigger an error
					this.trigger('user-update-error', error, request, response);
					return;
				}
				
				//trigger that we are good
				this.trigger('user-update-success', request, response);
			}.bind(this));
		}.bind(this));	
	}.bind(this));
};