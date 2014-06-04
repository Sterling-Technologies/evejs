define(function() {
	var c = function() {}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.title 		= 'Users';
	public.header 		= 'Users';
	public.subheader 	= 'CRM';
	public.crumbs 		= [{ icon: 'user', label: 'Users' }];
	
	public.data 	= {};
	public.template = controller.path('user/template') + '/index.html';
	
	/* Private Properties
	-------------------------------*/
	var $ 		= jQuery;
	var _api 	= 'http://api.eve.dev:8082/user';
	
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		return new c();
	};
	
	/* Construct
	-------------------------------*/
	/* Public Methods
	-------------------------------*/
	public.render = function() {
		$.sequence().setScope(this)
		.then(this.getData)
		.then(this.output);
		
		return this;
	};
	
	//TODO: GET JSON, PREPARE SET CALLBACK from Schema.
	public.getData = function(callback) {
		var self = this;
		$.getJSON(_api, function(response) {
			var i, rows = [];
			
			//if error
			if(response.error) {
				return;
			}
			//prepare template variables
			for(i in response.results) {
				var updated = new Date(response.results[i].updated);
				var format = controller.timeToDate(updated.getTime(), true, true);

				rows.push({
					name            : response.results[i].name,
					email           : response.results[i].email, 
					active          : response.results[i].active,
                    username        : response.results[i].username,
                    birthdate       : response.results[i].birthdate,
                    //data for basic
                    gender          : response.results[i].gender,
                    website         : response.results[i].website,
                    //data for social
                    facebook        : response.results[i].facebook,
                    twitter         : response.results[i].twitter,
                    google          : response.results[i].google,
                    //data for company
                    company_name    : response.results[i].name,
                    company_title   : response.results[i].title,
                    company_street  : response.results[i].street,
                    company_city    : response.results[i].city,
                    company_state   : response.results[i].state,
                    company_postal  : response.results[i].postal,
                    company_phone   : response.results[i].phone,
                    company_email   : response.results[i].email,
                    phone_label     : response.results[i].label,
                    phone_value     : response.results[i].value,
					updated: format }); 
            }

			
			self.data = {
				showing : 'Now Showing',
				rows	: rows,
				action	: 'active',
				all		: 76,
				active	: 24,
				guests	: 12,
				trash	: 4,
				range	: 15
			};
            
			callback();
		});
		
		return this;
	};
	
	public.output = function(callback) {
		controller
		.setTitle(this.title)
		.setHeader(this.header)
		.setSubheader(this.subheader)
		.setCrumbs(this.crumbs)
		.setBody(this.template, this.data);
		
		callback();
		
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c.load(); 
});