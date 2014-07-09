module.exports = function(controller, data) {
	var sequence = controller.eden.load('sequence');

	// store notification
	var data = {
		sender  : data.sender,
		details : data.message,
	};

	// get all users first
	sequence
	.then(function(next) {
		// get all users
		controller
			.notification()
			.store()
			.find({}, function(error, users) {
				// if there is an error
				if(error) {
					// trigger broadcast error
					return controller.trigger('notification-broadcast-error', error);
				}

				// if there is no users
				if(users.length === 0) {
					// trigger broadcast error
					return controller.trigger('notification-broadcast-error', { message : 'No users found' });
				}

				// passed in users
				next(users);
			});
	})
	.then(function(users, next) {
		// iterate on each users
		// and push the notifications
		// on their record
		for(var i in users) {
			// if user is same with the sender
			if(users[i]._id == data.sender) {
				// skip it, cause
				// we will not send
				// the notification to
				// the sender itself
				continue;
			}

			// fields to be updated
			var fields = {
				$set  : { 'notifications.status' : 'unread' },
				$push : { 
					'notifications.queue' 	: data,
					'notifications.list'    : data 
				}
			};

			// push notification to user's
			controller
				.notification()
				.store()
				.update(users[i]._id, fields, function(error, data) {
					// do nothing
				});
		}

		// trigger notification broadcast event
		return controller.trigger('notification-broadcast-success', data);
	});
};