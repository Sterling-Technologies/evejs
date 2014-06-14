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
	
	public.getData = function(callback) {
		var self = this;
		$.getJSON(_api, function(response) {
			var i, row, list = [];
			
			//if error
			if(response.error) {
				return;
			}
			
			//prepare template variables
			for(i in response.results) {
				row = {
					name: response.results[i].name,
					email: response.results[i].email, 
					street	: '',	city	: '',
					state	: '',	country	: '',
					postal	: '',	phone: '' };
				
				//have address ?
				if(response.results[i].address.length) {
					row.street = response
					.results[i].address[0].street;
					
					row.city = response
					.results[i].address[0].city;
					
					row.state = response
					.results[i].address[0].state;
					
					row.country = response
					.results[i].address[0].country;
					
					row.postal = response
					.results[i].address[0].postal;
				}
				
				//have phone ?
				if(response.results[i].phone.length) {
					row.phone = response
					.results[i].phone[0].value;
				}
				
				list.push(row);
			}
			
			self.data.list = list;
			
			callback();
		});
		
		return this;
	};
	
	public.output = function(callback) {
		controller
			.setTitle(this.title)
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