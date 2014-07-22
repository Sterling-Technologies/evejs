define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.title        = 'User Address Book';
    public.header       = 'User Address Book';
    public.subheader    = 'CRM';
	
    public.crumbs = [{ 
        path: '/user',
        icon: 'user', 
        label: 'Users' 
    }, {  label: 'Create User' }];

	public.data 	= {};
	public.template = controller.path('address-user/template') + '/index.html';

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
		 .then(_setData)
		 .then(_output);

		return this;
	};

	/* Private Methods
	-------------------------------*/
	var _setData = function(next) {
		var batch = [], query = $.getUrlQuery();

		// get user id
		this.data.id = controller.getUrlSegment(-1);

		// get list request
		batch.push({ url : _getListRequest.call(this, query) });
		// get active count
		batch.push({ url : _getActiveCountRequest.call(this, query) });
		// get trash count
		batch.push({ url : _getTrashCountRequest.call(this, query) });

		$.post(
			controller.getServerUrl() + '/address/batch', 
			JSON.stringify(batch), function(response) { 
			response = JSON.parse(response);
			
			var i, rows = [];
			
			//loop through data
			for(i in response.batch[0].results) {
				var updated = new Date(response.batch[0].results[i].updated);
				var created = new Date(response.batch[0].results[i].created);
				var format = $.timeToDate(updated.getTime(), true, true);
				var createdFormat = $.timeToDate(created.getTime(), true, true);
                
                //add it to row
				rows.push({
					id      	  : response.batch[0].results[i]._id,
					label 	      : response.batch[0].results[i].label,
					contact_name  : response.batch[0].results[i].contact_name,
					street    	  : response.batch[0].results[i].street,
					city    	  : response.batch[0].results[i].city,
					state		  : response.batch[0].results[i].state,
					country		  : response.batch[0].results[i].country,
					postal 		  : response.batch[0].results[i].postal,
					phone 		  : response.batch[0].results[i].phone,
					active		  : response.batch[0].results[i].active });
            }
			
			var showing = query.mode || 'active';
			showing = showing.toUpperCase().substr(0, 1) + showing.toLowerCase().substr(1);
			
			//1. List
			//2. Active Count
			//3. Trash Count
			//4. All Count
			this.data = {
				id 			: this.data.id,
				showing 	: showing,
				rows		: rows,
				mode		: query.mode || 'active',
				keyword		: query.keyword || null,
				active 		: response.batch[1].results,
				trash 		: response.batch[2].results,
				range		: this.range };

			next();
		}.bind(this));
	};

	var _output = function(next) {
		require(['text!' + public.template], function(template) {
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

	var _getListRequest = function(request) {
		// request query
		var query = {};
		
		// query filter
		query.filter 	= request.filter || {};
		// query range
		query.range		= request.range  || this.range;
		// query start
		query.start 	= request.start  || this.start;
		// query join
		query.join		= request.join 	 || { to : 'users', using : 'users._id', value : this.data.id };
		
		if(request.page) {
			query.start = (request.page - 1) * this.range;
		}
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}

		switch(request.mode || 'active') {
			case 'active':
				query.filter.active = 1;
				break;
			case 'trash':
				query.filter.active = 0;
				break;
		}
		
		return '/address/list?' + $.hashToQuery(query);
	};

	var _getTrashCountRequest = function(request) {
		var query = {};
		
		query.filter = request.filter || {};
		query.join	 = request.join 	 || { to : 'users', using : 'users._id', value : this.data.id };
		
		if(request.keyword) {
			query.keyword = request.keyword;
		}
		
		query.count = 1;
		query.filter.active = 0;
		
		return '/address/list?' + $.hashToQuery(query);
	};

	var _getActiveCountRequest = function(request) {
		var query = {};

		query.filter = request.filter || {};
		query.join	= request.join 	 || { to : 'users', using : 'users._id', value : this.data.id };

		if(request.keyword) {
			query.keyword = request.keyword;
		}

		query.count = 1;
		query.filter.active = 1;

		return '/address/list?' + $.hashToQuery(query);
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});