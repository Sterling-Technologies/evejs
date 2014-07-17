define(function() {
	var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;

	/* Public Properties
	-------------------------------*/
	public.data		= {};
	public.template = controller.path('addressuser/template') + '/form.html';

	/* Private Properties
	-------------------------------*/
	var $ 		= jQuery;
	var id 		= '';

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
	------------------------------*/
	var _setData = function(next) {
		// set mode
		this.data.mode 	= 'create';
		// get current location pathname
		this.data.url 	= window.location.pathname;
		// get user id 
		id 				= this.data.url.split('/')[3];
		
		// get post data
		var address = controller.getPost();

		console.log(address);
		
		// if address is present
		if(address && address.length) {
			// address data
			this.data.address = {};
			//query to hash
			this.data.address = $.queryToHash(address);
			// add user id
			this.data.address.user = id;

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
		controller.listen('user-update-ready', function() {
			require(['text!' + public.template], function(template) {
				var body = Handlebars.compile(template)(this.data);

				// get tab content target
				var target = $('div.tab-content');
				// append html
				target.html(body);

				next();
			}.bind(this));
		}.bind(this));
	};

	var _process = function(next) {
		var url = controller.getServerUrl() + '/addressuser/create';
		
		//save data to database
		$.post(url, this.data.address, function(response) {
			response = JSON.parse(response);
			
			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', 'address successfully created!', 'success')
					//go to listing
					.redirect('/user/update/' + id + '#user/address');
				
				//no need to next since we are redirecting out
				return;
			}
			
			this.data.errors = response.validation || {};
			
			//display message status
			controller.notify('Error', 'There was an error in the form.', 'error');
			
			next();
	   }.bind(this));
	};

	var _valid = function() {
		//clear errors
		this.data.errors = {};
		
		//local validate
		if(!this.data.address.street || 
		   !this.data.address.street.length) {
			this.data.errors.street = { message: 'Street name cannot be empty.'};
		}
		
		if(!this.data.address.city || 
		   !this.data.address.city.length) {
			this.data.errors.city = { message: 'City cannot be empty.'};
		}
		
		if(!this.data.address.province || 
		   !this.data.address.province.length) {
			this.data.errors.province = { message: 'Province cannot be empty.'};
		}

		if(!this.data.address.country || 
		   !this.data.address.country.length) {
			this.data.errors.country = { message: 'Country cannot be empty.'};
		}

		if(!this.data.address.zipcode || 
		   !this.data.address.zipcode.length) {
			this.data.errors.zipcode = { message: 'Zipcode cannot be empty.'};
		}
		
		//if we have no errors
		return JSON.stringify(this.data.errors) == '{}';
	};
	

	return c;	
});