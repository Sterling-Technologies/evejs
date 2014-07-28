define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.title        = 'Updating {USER}';
    public.header       = 'Updating {USER}';
    public.subheader    = 'CRM';
	
	public.start		= 0;
	public.page 		= 1;
	public.range 		= 25;

    public.crumbs = [{ 
        path: '/user',
        icon: 'user', 
        label: 'Users'
    }, {  label: 'Update User' }];

	public.data 	= {};
	public.template = controller.path('post-user/template') + '/user/index.html';

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
		this.data = {};
	};

	/* Public Methods
	-------------------------------*/
	public.render = function() {
		$.sequence()
		 .setScope(this)
		 .then(_getUserInfo)
		 .then(_setData)
		 .then(_output);

		return this;
	};

	/* Private Methods
	-------------------------------*/
	var _getUserInfo = function(next) {
		var id  = controller.getUrlSegment(-1),
		 	url = controller.getServerUrl() + '/user/detail/' + id;

		 $.getJSON(url, function(response) {
		 	this.data.user = response.results;

		 	next();
		 }.bind(this));
	};

	var _setData = function(next) {
		// get user id
		this.data.id = controller.getUrlSegment(-1);

		//use a batch call
		var batch = [], query = $.getUrlQuery();
		
		batch.push({ url: _getListRequest.call(this, query) });

		batch.push({ url: _getActiveCountRequest.call(this, query) });

		$.post(
			controller.getServerUrl() + '/post/batch', 
			JSON.stringify(batch), function(response) { 

			response = JSON.parse(response);
		
			var i, rows = [];
			
			//loop through data
			for(i in response.batch[0].results) {
				var updated = new Date(response.batch[0].results[i].updated);
				var format = $.timeToDate(updated.getTime(), true, true);

                //add it to row
				rows.push({
					id      	  : response.batch[0].results[i]._id,
					title    	  : response.batch[0].results[i].title,
					status    	  : response.batch[0].results[i].status,
					active		  : response.batch[0].results[i].active,
					updated 	  : format });

            }
			
			this.data = {
				id 		    : this.data.id,
				user  		: this.data.user,
				rows		: rows,
				active		: response.batch[1].results,
				range		: this.range };
            
			next();
		}.bind(this));
	};

	var _output = function(next) {
		require(['text!' + public.template], function(template) {
			var body = Handlebars.compile(template)(this.data);

			controller
				.setTitle(this.title.replace('{USER}', this.data.user.name))
				.setHeader(this.header.replace('{USER}', this.data.user.name))
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);

			next();
		}.bind(this));
	};

	var _getListRequest = function(request) {
		var query = {};
		
		query.filter 	= request.filter 	|| {};
		query.range		= request.range 	|| this.range;
		query.start 	= request.start 	|| this.start;
		
		if(request.page) {
			query.start = (request.page - 1) * this.range;
		}
		
		query.filter.active = 1;

		query.filter['users._id'] = controller.getUrlSegment(-1);

		return '/post/list?' + $.hashToQuery(query);
	};

	var _getActiveCountRequest = function(request) {
		var query = {};

		query.filter = request.filter || {};

		query.count 		= 1;
		query.filter.active = 1;

		query.filter['users._id'] = controller.getUrlSegment(-1);

		return '/post/list?' + $.hashToQuery(query);
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});