module.exports = function(id) {
	//create the model and save
	var model = this.{{name}}().model();
	
	model.{{name}}_id = id;
	model.{{name}}_active = '0';
	
	model.save(function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('{{name}}-remove-error', error);
			return;
		}
		
		//trigger that we are good
		this.trigger('{{name}}-remove-success');
	}.bind(this));
};