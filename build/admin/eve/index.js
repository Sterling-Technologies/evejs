controller()
//when the application is configured
.on('init', function() {
	//set paths
	this.path('utility', this.path('package') + '/core/utility/');	
	
	//load utilities
	require([
		this.path('utility') + 'array.js',
		this.path('utility') + 'hash.js',
		this.path('utility') + 'number.js',
		this.path('utility') + 'string.js',
		this.path('utility') + 'template.js',
		this.path('utility') + 'time.js'], 
		function(array, hash, number, string, template, time) {
			this.Array 	= array;
			this.Hash 	= hash;
			this.Number = number;
			this.String = string;
			this.Time 	= time;
			
			Handlebars.registerHelper('when', function() {
				return template().when.apply(this, arguments);
			});
					
			this.trigger('utility-init');
		}.bind(this));
	
	
});