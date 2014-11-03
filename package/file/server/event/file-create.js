module.exports = function(files, request, response) {
	var created = this.Time().toDate(Date.now(), 'Y-m-d H:i:s');
	
	if(!(files instanceof Array)) {
		files = [files];
	}
	
	this
	
	.sync(function(next) {
		next.thread('file-create', 0);	
	})
	
	.thread('file-create', function(i, next) {
		if(i < files.length) {
			var settings = {
				file_name		: request.files[i].name,
				file_mime		: request.files[i].mime,
				file_path		: request.files[i].path,
				file_created	: created };	
			
			this.package('file').model(settings).save(function(error, model) {
				//if there are errors
				if(error) {
					//trigger an error
					this.trigger('file-create-error', error);
					return;
				}
				
				//add the id to the file
				request.files[i].file_id = model.file_id;
				
				next.thread('file-create', i + 1);
			}.bind(this));
			return;
		}
		
		next();
	})
	
	.then(function(next) {
		//trigger that we are good
		this.trigger('file-create-success', files, request, response); 
	});
};