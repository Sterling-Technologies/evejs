define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.title        = 'Updating Address Book';
    public.header       = 'Updating Address Book';
    public.subheader    = 'CRM';
	
    public.crumbs = [{ 
        path: '/user',
        icon: 'user', 
        label: 'Users'
    }, {  label: 'Update User' }];

    public.start	= 0;
	public.page 	= 1;
	public.range 	= 25;

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

		$.post(
			controller.getServerUrl() + '/address/batch', 
			JSON.stringify(batch), function(response) { 
			response = JSON.parse(response);
			
			var i, rows = [];
			
			//loop through data
			for(i in response.batch[0].results) {
                //add it to row
				rows.push({
					id      	  : response.batch[0].results[i]._id,
					label 	      : response.batch[0].results[i].label,
					contact_name  : response.batch[0].results[i].contact_name,
					city    	  : response.batch[0].results[i].city,
					country		  : response.batch[0].results[i].country,
					active		  : response.batch[0].results[i].active,
					user 	  	  : response.batch[0].results[i].users[0]._id });
            }
			
			//1. List
			//2. Active Count
			//3. Trash Count
			//4. All Count
			this.data = {
				id 			: this.data.id,
				rows		: rows,
				active 		: response.batch[1].results,
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
		query.filter 	= { active : 1 };
		// query range
		query.range		= this.range;
		// query start
		query.start 	= this.start;
		// query join
		query.join		= { to : 'users', using : 'users._id', value : this.data.id };
		
		if(request.page) {
			query.start = (request.page - 1) * this.range;
		}
		
		return '/address/list?' + $.hashToQuery(query);
	};

	var _getActiveCountRequest = function(request) {
		var query = {};

		query.filter = { active : 1 };
		query.join	 = { to : 'users', using : 'users._id', value : this.data.id };

		query.count 		= 1;
		query.filter.active = 1;

		return '/address/list?' + $.hashToQuery(query);
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});