module.exports = function(controller, id, query) {
	//find and update
	controller
		.post()
		.store()
		.store
		//first find the id
<<<<<<< HEAD
		.findByIdAndUpdate(id, { { '_id' : ObjectId }, $set: { 'comment.$.active' : false } }, function(error) {
=======
		.findByIdAndUpdate({id, comment.id}, { $set: { active : false } }, function(error) {
>>>>>>> da99e58be62392774c3b160cf0026c90293aff05
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('post-remove-comment-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('post-remove-comment-success');
		});
};