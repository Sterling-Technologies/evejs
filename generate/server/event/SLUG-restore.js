module.exports = function(id, request, response) {
	{{~#if active}}
	//create the model and save
	var model = this.{{name}}().model();
	
	model.{{primary}} = id;
	model.{{active}} = '1';
	
	model.save(function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('{{name}}-restore-error', error, request, response);
			return;
		}
		
		//trigger that we are good
		this.trigger('{{name}}-restore-success', request, response);
	}.bind(this));
	
	{{~else~}}
	
	this.trigger('{{name}}-restore-error', '{{singular}} is not restorable.', request, response);
	
	{{~/if}}
};