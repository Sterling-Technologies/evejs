module.exports = function(controller, data) {
	// let's empty up the notification
	// queue
	var fields = {
		$set : { 'notifications.queue' : [] }
	};

	// update user record
	controller
		.notification()
		.store()
		.update(data.id, fields, function(error, user) {
			// if there is an error
			if(error) {
				// trigger notification remove event
				return controller.trigger('notification-remove-error', error);
			}

			// trigger notification remove success event
			return controller.trigger('notification-remove-success', {});
		});
};