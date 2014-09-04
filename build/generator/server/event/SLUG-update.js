module.exports = function(controller, id, query, stream) {
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
		
		//find and update
		controller.{{name}}().store().update(id, query, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('{{name}}-update-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('{{name}}-update-success');
		});
		
		return;
	}
	
	controller.{{name}}().upload(stream, function(error, query) {		
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('{{name}}-update-error', error);
			return;
		}
			
		//create the model and save
		controller.{{name}}().store().update(id, query, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('{{name}}-update-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('{{name}}-update-success');
		});
	});
};