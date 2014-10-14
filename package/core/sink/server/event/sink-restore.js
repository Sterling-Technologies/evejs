module.exports = function(id) {
	//create the model and save
	this.sink()
		.model()
		.setSinkId(id)
		.setSinkActive('1')
		.save(function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				this.trigger('sink-restore-error', error);
				return;
			}
			
			//trigger that we are good
			this.trigger('sink-restore-success');
		}.bind(this));
};