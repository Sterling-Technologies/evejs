define(function() {
	var c = function() {}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.title 		= 'Users';
	
	public.data 	= {};
	public.template = controller.path('user/template') + '/index.html';
	
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
		var url = controller.getServerUrl() + '/user';
		
		$.getJSON(url, function(response) {
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
			
			this.data.list = list;
			
			next();
		}.bind(this));
		
		return this;
	};
	
	var _output = function(next) {
		//bulk load the templates
		require(['text!' + this.template], function(template) {
			var body = Handlebars.compile(template)(this.data);
			
			controller
				.setTitle(this.title)
				.setBody(body);
			
			next();
		}.bind(this));
	};
	
	/* Adaptor
	-------------------------------*/
	return c.load(); 
});