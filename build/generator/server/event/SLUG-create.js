module.exports = function(controller, query, stream) {
	if(!stream) {
		//validate
		var errors = controller.sample().getErrors(query);
		
		//if there are errors
		if(errors.length) {
			//trigger an error
			controller.trigger('{{name}}-create-error', { 
				message: 'Data sent to server is invalid', 
				errors: errors });
		}
		
		//create the model and save
		controller.{{name}}().store().insert(query, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('{{name}}-create-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('{{name}}-create-success');
		});
		
		return;
	}
	
	controller.{{name}}().upload(stream, function(error, query) {		
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('{{name}}-create-error', error);
			return;
		}
			
		//create the model and save
		controller.{{name}}().store().insert(query, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('{{name}}-create-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('{{name}}-create-success');
		});
	});
};