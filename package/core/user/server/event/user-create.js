module.exports = function(controller, query) {
	//create the model and save
	controller.user().insert(query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('user-create-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('user-create-success');
	});
};