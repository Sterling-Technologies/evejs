module.exports = function(controller, id, query) {
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
};