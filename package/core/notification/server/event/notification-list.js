module.exports = function(controller, data) {
	// get all notifications 5 days until now
	var from = Date.now - (5 * 86400);
	// query
	var query = {
		_id 	: data.id
		// 'notifications.list.created' : { $gt : from }
	};

	var sequence = controller.eden.load('sequence');

	// fetch all notifications
	// including queued notifications
	controller
		.notification()
		.store()
		.find(query, function(error, user) {
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

			// sort results, we can't sort
			// the objects inside objects
			// in mongoose, because the columns
			// are dynamically injected in user
			// store
			sequence
			// sort queue
			.then(function(next) {
				var queue  = [],
					length = user[0].notifications.queue.length; 

				if(length == 0) {
					next(queue);
				}

				user[0]
					.notifications
					.queue
					.sort(function(a, b) {
						return b.created - a.created;
					})
					.forEach(function(data) {
						queue.push(data);

						if(length == queue.length) {
							next(queue);
						}
					});
			})
			// sort list
			.then(function(queue, next) {
				var list   = [],
					length = user[0].notifications.list.length;

				if(length == 0) {
					next(queue, list);
				}

				user[0]
					.notifications
					.list
					.sort(function(a, b) {
						return b.created - a.created;
					})
					.forEach(function(data) {
						list.push(data);

						if(length == list.length) {
							next(queue, list);
						}
					});
			})
			// now return sorted data
			.then(function(queue, list) {
				var notifications = {
					queue : [queue],
					list  : [list]
				};

				// trigger notification list success event
				return controller.trigger('notification-list-success', notifications);
			});
		});
};