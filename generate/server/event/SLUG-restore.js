module.exports = function(id) {
	//create the model and save
	var model = this.{{name}}().model();
	
	model.{{name}}_id = id;
	model.{{name}}_active = '1';
	
	model.save(function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('{{name}}-restore-error', error);
			return;
		}
		
		//trigger that we are good
		this.trigger('{{name}}-restore-success');
	}.bind(this));
};