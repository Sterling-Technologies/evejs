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
			.then(_output)
			.then(_listen);
		
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	var _setData = function(next) {
		var url = controller.getServerUrl() + '/user';
		
		$.getJSON(url, function(response) {
			var i, rows = [];
			
			//if error
			if(response.error) {
				return;
			}

			//loop through data
			for(i in response.results) {
				var updated = new Date(response.results[i].updated);
				var format = $.timeToDate(updated.getTime(), true, true);
                
                //add it to row
				rows.push({
					id              : response.results[i]._id,
					name            : response.results[i].name,
					email           : response.results[i].email, 
					active          : response.results[i].active,
					updated: format });
                }
			
			//TODO: default data for now.
			this.data = {
				showing : 'Now Showing',
				rows	: rows,
				action	: 'active',
				all		: 76,
				active	: 24,
				guests	: 12,
				trash	: 4,
				range	: 15
			};
            
			next();
		}.bind(this));
	};

	var _output = function(next) {
		//bulk load the templates
		require(['text!' + this.template], function(template) {
			//render the body
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
	
	var _listen = function(next) {
		//listen to remove
		$('section.user-list a.remove').click(function(e) {
			e.preventDefault();
			$(this).parent().parent().remove();
		});
		
		next();
	};
	
	/* Adaptor
	-------------------------------*/
	return c.load(); 
});