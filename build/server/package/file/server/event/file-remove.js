module.exports = function(id, request, response) {
	//create the model and save
	var model = this.package('file').model();
	
	model.file_id = id;
	model.file_active = '0';
	
	model.save(function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('file-remove-error', error, request, response);
			return;
		}
		
		//trigger that we are good
		this.trigger('file-remove-success', request, response);
	}.bind(this));
};