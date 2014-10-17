module.exports = function(id, request, response) {
	//create the model and save
	var model = this.{{name}}().model();
	
	model.{{primary}} = id;
	
	{{~#if active}}
	model.{{active}} = '0';
	
	model.save(function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('{{name}}-remove-error', error, request, response);
			return;
		}
		
		//trigger that we are good
		this.trigger('{{name}}-remove-success', request, response);
	}.bind(this));
	
	{{~else~}}
	
	model.remove(function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			this.trigger('{{name}}-remove-error', error, request, response);
			return;
		}
		
		//trigger that we are good
		this.trigger('{{name}}-remove-success', request, response);
	}.bind(this));
	
	{{~/if}}
};