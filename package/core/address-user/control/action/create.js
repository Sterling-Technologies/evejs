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
		this.data.id 		= controller.getUrlSegment(-1);
		
		var data = controller.getPost();

		if(data && data.length) {
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
		// render user address create form
		require(['text!' + public.template], function(form) {
			var body = Handlebars.compile(form)(this.data);

			controller
				.setTitle(this.title)
				.setHeader(this.header)
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);

			next();
		}.bind(this));
	};

	var _valid = function() {
		//clear errors
		this.data.errors = {};
	
		// validate fields
		if(!this.data.address.street || !this.data.address.street.length) {
			this.data.errors.street = { message: 'Street name cannot be empty.'};
		}
		
		if(!this.data.address.city || !this.data.address.city.length) {
			this.data.errors.city = { message: 'City cannot be empty.'};
		}
		
		if(!this.data.address.state || !this.data.address.state.length) {
			this.data.errors.state = { message: 'State cannot be empty.'};
		}

		if(!this.data.address.country || !this.data.address.country.length) {
			this.data.errors.country = { message: 'Country cannot be empty.'};
		}

		if(!this.data.address.postal || !this.data.address.postal.length) {
			this.data.errors.postal = { message: 'Postal Code cannot be empty.'};
		}
		
		//if we have no errors
		return JSON.stringify(this.data.errors) == '{}';
	};

	var _process = function(next) {
		var url = controller.getServerUrl() + '/address/join?collection=users',
			id  = controller.getUrlSegment(-1);
		
		//save data to database
		$.post(url, this.data.address, function(response) {
			response = JSON.parse(response);
			
			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', 'address successfully created!', 'success')
					//go to listing
					.redirect('/user/address/' + id);
				
				//no need to next since we are redirecting out
				return;
			} 
			
			this.data.errors = response.validation || {};
			
			//display message status
			controller.notify('Error', 'There was an error in the form.', 'error');
			
			next();
	   }.bind(this));
	};

	/* Adaptor
	-------------------------------*/
	return c; 
});