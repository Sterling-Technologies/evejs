define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.title 		= 'User Address - Create';
	public.header       = 'User Address - Create';
    public.subheader    = 'CRM';
	
    public.crumbs = [{ 
        path: '/user',
        icon: 'user', 
        label: 'Users' 
    }, {  label: 'Create User' }];

	public.data 	= {};
	public.template = controller.path('address-user/template') + '/form.html';

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
		this.data.mode 		= 'create';
		this.data.url 		= window.location.pathname;
		parentId 			= controller.getUrlSegment(-1);
		
		var data = controller.getPost();

		if(data && data.length) {
			if(parentId !== '') {
				data = 'parent=' + parentId + '&' + data;
			} else {
				data = 'parent=&' + data;
			}

			//query to hash
			this.data.address = $.queryToHash(data);
			
			if(!_valid.call(this)) {			
				//display message status
				controller.notify('Error', 'There was an error in the form.', 'error');
				next();
				
				return;
			}
			
			//we are good to send this up
			_process.call(this, next);
			
			next();
			return;
		}
		
        next();
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

	/* Adaptor
	-------------------------------*/
	return c; 
});