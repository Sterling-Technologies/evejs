define(function() {
   return jQuery.eve.action.extend(function() {
		/* Require
		-------------------------------*/
		var $ = jQuery;
		
		/* Public Properties
		-------------------------------*/
		/* Protected Properties
		-------------------------------*/
		this._title 	= 'Blocks';
		this._header 	= 'Blocks';
		this._subheader = 'Template One';
		this._crumbs 	= [{ icon: 'desktop', label: 'Blocks' }];
		this._data 		= {};
		
		this._start		= 0;
		this._page 		= 1;
		this._range 	= 25;
		
		this._template 	= controller().path('block/template') + '/index.html';
		
		/* Private Properties
		-------------------------------*/
		/* Public Methods
		-------------------------------*/
		/* Protected Methods
		-------------------------------*/
		this._setData = function(next) {
			
			this._data.list = [
				{ value: 1, label: 'Label 1' },
				{ value: 2, label: 'Label 2' },
				{ value: 3, label: 'Label 3' },
				{ value: 4, label: 'Label 4' } ];
				
			this._data.error = { name: 'Name cannot be empty.' };
			
			this._data.complete = { 
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
	
		this._output = function(next) {
			//bulk load the templates
			require(['text!' + this._template], function(template) {
				//render the body
				var body = Handlebars.compile(template)(this._data);
				
				controller()
					.setTitle(this._title)
					.setHeader(this._header)
					.setSubheader(this._subheader)
					.setCrumbs(this._crumbs)
					.setBody(body);
				
				next();
			}.bind(this));
		};
		
		/* Private Methods
		-------------------------------*/
	});
});