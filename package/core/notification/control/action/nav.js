define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.template  	= controller.path('notification/template') + '/nav.html';
	public.data 	 	= {};

	public.notification = io.connect(controller.getServerUrl() + '/notification');
	public.list 		= io.connect(controller.getServerUrl() + '/notification/list');
	public.remove 		= io.connect(controller.getServerUrl() + '/notification/remove');

	/* Private Properties
	-------------------------------*/
	var $  			  = jQuery;
	var oldurl  	  = null;
	var notifications = 0;

	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		return new c();
	};
	
	/* Construct
	-------------------------------*/
	public.__construct = function() {
		//reset data because of "pass by ref"
		this.data = {};
	};
	
	/* Public Methods
	-------------------------------*/
	public.render = function() {
		$.sequence()
			.setScope(this)
			.then(_setData)
			.then(_output)
			.then(_listen);
		
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	var _setData = function(next) {
		var session = JSON.parse($.cookie('__acc')) || {};

		this.list.emit('notification-fetch', { id : session.id });
		this.list
			.removeAllListeners('notification-list')
			.on('notification-list', _processList.bind(this));

		// default socket connection
		this.notification = 
		// setup notification listener
		this.notification
			// clean up listeners
			.removeAllListeners('notification')
			// on notification event
			.on('notification', _process.bind(this));

		next();
	};

	var _output = function(next) {
		//bulk load the templates
		require(['text!' + this.template], function(template) {
			//render the body
			var body = Handlebars.compile(template)(this.data);

			// Check if nav already exist
			var nav = $('ul.nav.ace-nav').find('li.nav-notification');

			// If nav does not exists
			if(nav.length == 0) {
				// Inject user nav into right nav
				$('ul.nav.ace-nav').prepend(body);
			}

			next();
		}.bind(this));
	};
	
	var _listen = function(next) {
		// listen to all request
		$.ajaxPrefilter(function(options, original, jqxhr) {
			// get the requested url
			var url = original.url;

			// create action
			var create    = url.indexOf('/create');
			// update action
			var update    = url.indexOf('/update');
			// remove action
			var remove    = url.indexOf('/remove');
			// restore action
			var restore   = url.indexOf('/restore');
			// type of action
			var type      = null;
			// notification message
			var message   = '';

			// if request is the same
			if(oldurl == url) {
				// do nothing just to
				// avoid multiple emit
				return;
			}

			// check if action is create, update
			// remove or restore
			if(create == -1 && update == -1 && 
			   remove == -1 && restore == -1) {
				return;
			}

			// user session
			var session   = JSON.parse($.cookie('__acc')) || {};
			// user firstname
			var firstname = session.name.substring(0, session.name.indexOf(' ')) || 'User';
			// user id
			var userid 	  = session.id;

			// case actions
			switch(true) {
				case create !== -1 : 
					type 	= url.substring(url.lastIndexOf('/', create - 2) + 1, create);
					message = firstname + ' has created a ' + type;

					this.notification.emit('notify-client-action', { sender: userid, message : message });
					break;
				case update !== -1 :
					type = url.substring(url.lastIndexOf('/', update - 2) + 1, update);
					message = firstname + ' has updated a ' + type;

					this.notification.emit('notify-client-action', { sender: userid, message : message });
					break;
				case remove !== -1 :
					type = url.substring(url.lastIndexOf('/', remove - 2) + 1, remove);
					message = firstname + ' has removed a ' + type;

					this.notification.emit('notify-client-action', { sender: userid, message : message });
					break;
				case restore !== -1 :
					type = url.substring(url.lastIndexOf('/', restore - 2) + 1, restore);
					message = firstname + ' has restored a ' + type;

					this.notification.emit('notify-client-action', { sender: userid, message : message });
					break;
				default :
					break;
			}

			oldurl = original.url;
		}.bind(this));

		// if user clicks the nav-notification
		$('li.nav-notification').on('click', function() {
			// If there is no unread notification
			if(notifications == 0) {
				// just do nothing
				return;
			}

			// get user session first
			var session = JSON.parse($.cookie('__acc')) || {};

			// we will emit notification-clear event for
			// clearing queued notifications
			this.remove.emit('notification-clear', { id : session.id });

			this.remove
				// clean all listeners
				.removeAllListeners('notification-cleared')
				// on notification cleared
				.on('notification-cleared', _clearUnreadNotification.bind(this));

		}.bind(this));
	};

	var _process = function(data) {
		// increment counter
		notifications++;

		// badge counter
		var badge = $('li.nav-notification a.dropdown-toggle span.total-notif-badge');
		// target container
		var nav   = $('li.nav-notification ul li.dropdown-header');
		// build out notification html
		var tpl   = _buildNotification(data.result.details);

		// update badge counter
		badge.html(notifications);
		// append notification
		nav.after(tpl);
		// update notification counter
		nav.find('span.total-notifications').html(notifications + ' Notifications');

		// remove animation class on bell, and re-add it again
		// just to make it alive :D
		$('li.nav-notification a.dropdown-toggle i.icon-bell-alt')
			// remove animation class
			.removeClass('icon-animated-bell')
			// add animation class again
			.addClass('icon-animated-bell');

		return;
	};

	var _buildNotification = function(message) {
		// notification template
		var tpl = '<li><a href="#">' +
				  '<i class="btn btn-xs btn-primary icon-user"></i>' + message + 
				  '</a></li>';

		return tpl;
	};

	var _processList = function(data) {
		// badge counter
		var badge = $('li.nav-notification a.dropdown-toggle span.total-notif-badge');
		// navigation container
		var nav   = $('li.nav-notification ul li.dropdown-header');
		// buffer for notifications
		var html  = '';
		// total notifications
		var total = data.result.queue[0].length || '';

		// set total notifications based
		// on total queue notifications
		notifications = total;
		
		// build notification template
		// for each notification
		for(var i in data.result.list[0]) {
			html += _buildNotification(data.result.list[0][i].details);
		}

		// update badge total
		badge.html(total);
		// append html notifications
		nav.after(html);
		// update notification counter
		nav.find('span.total-notifications').html(total + ' Notifications');
	};

	var _clearUnreadNotification = function(data) {
		// badge counter
		var badge = $('li.nav-notification a.dropdown-toggle span.total-notif-badge');
		// navigation container
		var nav   = $('li.nav-notification ul li.dropdown-header');

		// reset notification count
		notifications = 0;
		// clear badge
		badge.html('');
		// update notification counter
		nav.find('span.total-notifications').html('0 Notifications');
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});