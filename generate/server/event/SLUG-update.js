module.exports = function(id, settings) {
	//validate
	var errors = this.{{name}}().getErrors(settings);
	
	//if there are errors
	if(errors.length) {
		//trigger an error
		this.trigger('{{name}}-update-error', { 
			message: 'Data sent to server is invalid', 
			errors: errors });
	}
	
	//create the model and save
	var model = this.{{name}}().model(settings)
		
	model.{{name}}_id = id;
	
	model.save(function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('{{name}}-update-error', error);
			return;
		}
		
		//trigger that we are good
		this.trigger('{{name}}-update-success');
	}.bind(this));
};