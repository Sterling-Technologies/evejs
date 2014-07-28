module.exports = function(controller, query) {
	//create the model and save
	controller.category().store().insert(query, function(error, result) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('category-create-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('category-create-success', result);
	});
};