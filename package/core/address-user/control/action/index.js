define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.title        = 'Updating {USER}';
    public.header       = 'Updating {USER}';
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
		this.data.id  = controller.getUrlSegment(-1);
		this.data.url = controller.getServerUrl() + '/user/detail/' + this.data.id + 
						'?join[to]=addresses&join[using]=addresses._id';

		$.getJSON(this.data.url, function(response) {
			// get user information
			this.data.user = response.results;

			// get address the user has
			var addresses = response.results.addresses;

			if(addresses !== undefined && addresses.length !== 0) {
				this.data.rows = [], length = addresses.length;

				for(var i = 0; i < length; i ++) {
					if(addresses[i]._id !== null && addresses[i]._id.active) {
						this.data.rows.push({
							id 				: addresses[i]._id._id,
							label 			: addresses[i]._id.label,
							contact_name 	: addresses[i]._id.contact_name,
							city 			: addresses[i]._id.city,
							country 		: addresses[i]._id.country,
							active 			: addresses[i]._id.active,
							user_id 		: response.results._id
						});
					}
				}
			}

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

	/* Adaptor
	-------------------------------*/
	return c; 
});