module.exports = function(id, request, response) {
	//create the model and save
	var model = this.package('file').model();
	
	model.file_id = id;
	model.file_active = '1';
	
	model.save(function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('file-restore-error', error, request, response);
			return;
		}
		
		//trigger that we are good
		this.trigger('file-restore-success', request, response);
	}.bind(this));
};