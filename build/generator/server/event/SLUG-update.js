module.exports = function(controller, id, query) {
	//find and update
	controller.{{slug}}().store().update(id, query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('{{slug}}-update-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('{{slug}}-update-success');
	});
};