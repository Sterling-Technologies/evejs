module.exports = function(controller, id, query) {
	//find and update
	controller
		.post()
		.store()
		.store
<<<<<<< HEAD
		//first find the id
		.findByIdAndUpdate(id, { { _id : ObjectId, 'comment.$.active' : true }, $set: { comment : query } }, function(error) {
=======
		//first find the comment id
		.findByIdAndUpdate({id, comment.id},  { $set: { comment : query } }, function(error) {
>>>>>>> da99e58be62392774c3b160cf0026c90293aff05
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('post-update-comment-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('post-update-comment-success');
		});
};