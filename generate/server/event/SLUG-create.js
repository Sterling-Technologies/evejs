module.exports = function(settings) {
	//validate
	var errors = this.{{name}}().getErrors(settings);
	
	//if there are errors
	if(errors.length) {
		//trigger an error
		this.trigger('{{name}}-create-error', { 
			message: 'Data sent to server is invalid', 
			errors: errors });
	}
	
	//create the model and save
	this.{{name}}().model(settings).save(function(error, model) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('{{name}}-create-error', error);
			return;
		}
		
		//trigger that we are good
		this.trigger('{{name}}-create-success', model.getSinkId());
	}.bind(this));
};