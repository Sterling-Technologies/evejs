module.exports = function(id) {
	//create the model and save
	this.sink()
		.model()
		.setSinkId(id)
		.setSinkActive('0')
		.save(function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				this.trigger('sink-remove-error', error);
				return;
			}
			
			//trigger that we are good
			this.trigger('sink-remove-success');
		}.bind(this));
};