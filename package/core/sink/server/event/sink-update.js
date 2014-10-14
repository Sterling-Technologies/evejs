module.exports = function(id, settings) {
	//validate
	var errors = this.sink().getErrors(settings);
	
	//if there are errors
	if(errors.length) {
		//trigger an error
		this.trigger('sink-update-error', { 
			message: 'Data sent to server is invalid', 
			errors: errors });
	}
	
	//create the model and save
	this.sink()
		.model(settings)
		.setSinkId(id)
		.save(function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				this.trigger('sink-update-error', error);
				return;
			}
			
			//trigger that we are good
			this.trigger('sink-update-success');
		}.bind(this));
};