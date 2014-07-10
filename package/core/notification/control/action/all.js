define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.title        = 'Notifications';
    public.header       = 'Notifications';
    public.subheader    = 'All notifications';
	public.template 	= controller.path('notification/template') + '/all.html';
	
	public.crumbs = [{ 
        path: '/notification/all',
        icon: 'bell', 
        label: 'Notifications' 
    }, {  label: 'All' }];

    public.list = io.connect(controller.getServerUrl() + '/notification/list');

	/* Private Properties
	-------------------------------*/
	var $ = jQuery;

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
			.then(_output);
		
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	var _setData = function(next) {
 		var session = JSON.parse($.cookie('__acc')) || {};

		// fetch all notifications
		this.list.emit('notification-fetch', { id : session.id });
		// on notification list
		this.list
			// clear up all listeners
			.removeAllListeners('notification-list')
			// on notification list
			.on('notification-list', function(data) {
				// if there is a data
				if(data.result.list[0].length !== 0) {
					this.data.notifications = _groupByDate(data.result.list[0]);
				}

				next();
		}.bind(this));
	};

	var _output = function(next) {
		//bulk load the templates
		require(['text!' + this.template], function(template) {
			//render the body
			var body = Handlebars.compile(template)(this.data);

			controller
				.setTitle(this.title)
				.setHeader(this.header)
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);

			next();
		}.bind(this));
	};
	
	var _groupByDate = function(data) {
		var group = {}, 
			today = new Date().toDateString();

		// define keys per date
		for(var i in data) {
			// convert to real date
			var date = new Date(data[i].created).toDateString();

			// if date is == today
			if(date == today) {
				date = 'Today';
			}

			// if index is not yet in group
			if(group[date] === undefined) {
				group[date] = [];
			}

			// format date to time
			data[i].created = _getHour(data[i].created);
			// push date in group
			group[date].push(data[i]);
		}

		return group;
	};

	var _getHour = function(date) {
		var date = new Date(date);
		var hour = date.getHours();
		var min  = date.getMinutes();
		var ampm = hour >= 12 ? 'PM' : 'AM';

		hour = hour % 12;
		hour = hour ? hour : 12;
		min  = min < 10 ? '0' + min : min;

		var time = hour + ':' + min + ' ' + ampm; 

		return time;
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});