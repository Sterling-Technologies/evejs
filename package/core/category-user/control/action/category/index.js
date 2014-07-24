define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.title        = 'Updating Category Users';
    public.header       = 'Updating Category Users';
    public.subheader    = 'CRM';
	
	public.start		= 0;
	public.page 		= 1;
	public.range 		= 25;

    public.crumbs = [{ 
        path: '/category',
        icon: 'sitemap', 
        label: 'Categories'
    }, {  label: 'Update Category' }];

	public.data 	= {};
	public.template = controller.path('category-user/template') + '/category/index.html';

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
		//use a batch call
		var batch = [], query = $.getUrlQuery();
		
		//1. get the list
		batch.push({ url: _getListRequest.call(this, query) });
		
		//2. get the active count
		batch.push({ url: _getActiveCountRequest.call(this, query) });

		$.post(
			controller.getServerUrl() + '/user/batch', 
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
					name    	  : response.batch[0].results[i].name,
					email    	  : response.batch[0].results[i].email,
					active		  : response.batch[0].results[i].active,
					updated 	  : format });
            }
			
			var showing = query.mode || 'active';
			showing = showing.toUpperCase().substr(0, 1) + showing.toLowerCase().substr(1);
			
			//1. List
			//2. Active Count
			//3. Trash Count
			//4. All Count
			this.data = {
				showing 	: showing,
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
				.setTitle(this.title)
				.setHeader(this.header)
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

		query.filter['categories._id'] = controller.getUrlSegment(-1);

		return '/user/list?' + $.hashToQuery(query);
	};

	var _getActiveCountRequest = function(request) {
		var query = {};

		query.filter = request.filter || {};

		query.count 		= 1;
		query.filter.active = 1;

		query.filter['categories._id'] = controller.getUrlSegment(-1);

		return '/user/list?' + $.hashToQuery(query);
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});