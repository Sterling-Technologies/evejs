module.exports = function(controller, data) {
	// fetch all notifications
	// including queued notifications
	controller
		.notification()
		.store()
		.find({ _id : data.id }, function(error, user) {
			// if there is an error
			if(error) {
				// trigger notification list error event
				return controller.trigger('notification-list-error', error);
			}

			// if there is no user
			if(user.length == 0) {
				// trigger notification list error
				return controller.trigger('notification-list-error', { messsage : 'Cannot pull notifications' });
			}

			// fields to be returned back
			var notifications = {
				queue : [user[0].notifications.queue] || [],
				list  : [user[0].notifications.list] || []
			};

			// trigger notification list success event
			return controller.trigger('notification-list-success', notifications);
		});
};