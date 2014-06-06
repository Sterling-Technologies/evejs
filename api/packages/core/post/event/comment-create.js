module.exports = function(controller, id, query) {
	//find and update
	controller
		.post() 
		.store()
		.store
		//first find the id
		.findByIdAndUpdate({ _id : id }, { $push: { comments: query } }, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('post-comment-create-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('post-comment-create-success');
		});
};
