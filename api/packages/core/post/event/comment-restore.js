module.exports = function(controller, id, query) {
	//find and update
	controller
		.post()
		.store()
		.store
		//first find the id
<<<<<<< HEAD
		.findByIdAndUpdate(id, { { '_id' : ObjectId }, $set: { 'comment.$.active' : true } }, function(error) {
=======
		.findByIdAndUpdate({id, comment.id},  { $set: { active : true } }, function(error) {
>>>>>>> da99e58be62392774c3b160cf0026c90293aff05
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('post-restore-comment-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('post-restore-comment-success');
		});
};