define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.title 		= 'Blocks';
	public.header 		= 'Blocks';
	public.subheader 	= 'Template One';
	public.crumbs 		= [{ icon: 'desktop', label: 'Blocks' }];
	public.data 		= {};
	
	public.start		= 0;
	public.page 		= 1;
	public.range 		= 25;
	
	public.template 	= controller.path('block/template') + '/index.html';
	
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
		//reset data because of "pass by ref"
		this.data = {};
	};
	
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
		
		this.data.list = [
			{ value: 1, label: 'Label 1' },
			{ value: 2, label: 'Label 2' },
			{ value: 3, label: 'Label 3' },
			{ value: 4, label: 'Label 4' } ];
			
		this.data.error = { name: 'Name cannot be empty.' };
		
		this.data.complete = { 
			local: [
				'Lorem Ipsum', 
				'Ipsum Dolor',
				'Dolor Levity',
				'Levity Dasma',
				'Dasma Dogity',
				'Dogity Lorem',
				'Lord Of the Rings']
		};
		
		next();
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
		next();
	};
	
	/* Adaptor
	-------------------------------*/
	return c; 
});